// Contains database queries for alarm CRUD

import * as SQLite from 'react-native-sqlite-storage';
import {Location} from '../models/Location';
import {AlarmBasic, AlarmComplete} from '../models/Alarm';
import {NotifyingDistance, DistanceUnitsEnum} from '../models/NotifyingDistance';

SQLite.enablePromise(true);

export class AlarmDAO {
    private static db: SQLite.SQLiteDatabase | null = null;

    // Initialize database
    static async init() {
        if (!this.db) {
            this.db = await SQLite.openDatabase({name: 'alarm.db', location: 'default'});
            await this.db.executeSql('PRAGMA foreign_keys = ON;');

            // Create tables
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS alarms
                (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    display_name TEXT    NOT NULL,
                    is_disabled  INTEGER NOT NULL DEFAULT 0
                );
            `);

            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS locations
                (
                    id        INTEGER PRIMARY KEY AUTOINCREMENT,
                    alarm_id  INTEGER NOT NULL UNIQUE,
                    address   TEXT    NOT NULL,
                    latitude  REAL    NOT NULL,
                    longitude REAL    NOT NULL,
                    FOREIGN KEY (alarm_id) REFERENCES alarms (id) ON DELETE CASCADE
                );
            `);

            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS notifying_distances
                (
                    id       INTEGER PRIMARY KEY AUTOINCREMENT,
                    alarm_id INTEGER NOT NULL,
                    distance REAL    NOT NULL,
                    unit     TEXT    NOT NULL,
                    FOREIGN KEY (alarm_id) REFERENCES alarms (id) ON DELETE CASCADE
                );
            `);
        }
    }

    // Add alarm
    static async addAlarm(
        name: string,
        location: Location,
        notifyingDistances: NotifyingDistance[]
    ): Promise<number> {
        if (!this.db) throw new Error('Local database not initialized');

        let newAlarmId: number | undefined;

        await this.db.transaction(async (tx) => {
            const [, alarmResult] = await tx.executeSql(
                'INSERT INTO alarms (display_name) VALUES (?);',
                [name]
            );

            const alarmId = alarmResult.insertId;
            if (!alarmId) {
                throw new Error('Failed to insert alarm and get an ID.');
            }

            newAlarmId = alarmId;

            await tx.executeSql(
                'INSERT INTO locations (alarm_id, address, latitude, longitude) VALUES (?, ?, ?, ?);',
                [alarmId, location.address, location.latitude, location.longitude]
            );

            const distanceInsertPromises = notifyingDistances.map(dist => {
                return tx.executeSql(
                    'INSERT INTO notifying_distances (alarm_id, distance, unit) VALUES (?, ?, ?);',
                    [alarmId, dist.distance, dist.unit]
                );
            });
            await Promise.all(distanceInsertPromises);
        });

        if (newAlarmId === undefined) {
            throw new Error('Transaction succeeded but alarm ID was not captured.');
        }
        return newAlarmId;

    }

    // Delete an alarm
    static async deleteAlarm(alarmId: number) {
        if (!this.db) throw new Error('Local database not initialized');

        await this.db.executeSql('DELETE FROM alarms WHERE id = ?;', [alarmId]);
    }

    // Get an alarm
    static async getAlarm(alarmId: number): Promise<AlarmComplete | null> {
        if (!this.db) throw new Error('Local database not initialized');

        const [result] = await this.db.executeSql(`
            SELECT a.id           as alarmId,
                   a.display_name as displayName,
                   a.is_disabled  as isDisabled,
                   l.address,
                   l.latitude,
                   l.longitude,
                   nd.id          as notifyingDistanceId,
                   nd.distance,
                   nd.unit
            FROM alarms a
                     LEFT JOIN locations l ON a.id = l.alarm_id
                     LEFT JOIN notifying_distances nd ON a.id = nd.alarm_id
            WHERE a.id = ?;
        `, [alarmId]);

        if (result.rows.length === 0) {
            return null;
        }

        const firstRow = result.rows.item(0);
        const alarm: AlarmComplete = {
            alarmId: firstRow.alarmId,
            displayName: firstRow.displayName,
            isDisabled: !!firstRow.isDisabled,
            location: {
                address: firstRow.address,
                latitude: firstRow.latitude,
                longitude: firstRow.longitude,
            },
            notifyingDistances: []
        };

        for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            if (row.notifyingDistanceId) {
                alarm.notifyingDistances.push({
                    distanceId: row.notifyingDistanceId,
                    distance: row.distance,
                    unit: row.unit
                });
            }
        }

        return alarm;
    }

    // Get all alarms
    static async getAlarms(): Promise<AlarmBasic[]> {
        if (!this.db) throw new Error('Local database not initialized');

        const [result] = await this.db.executeSql(`
            SELECT alarms.*, locations.address
            FROM alarms
                     LEFT JOIN locations ON alarms.id = locations.alarm_id;
        `);

        const alarms: AlarmBasic[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            alarms.push({
                alarmId: row.id,
                displayName: row.display_name,
                isDisabled: !!row.is_disabled,
                address: row.address
            });
        }

        return alarms;
    }

    // Change location of an alarm
    static async changeLocation(alarmId: number, location: Location) {
        if (!this.db) throw new Error('Local database not initialized');

        await this.db.executeSql(
            `UPDATE locations
             SET address = ?,
                 latitude = ?,
                 longitude = ?
             WHERE alarm_id = ?;`,
            [location.address, location.latitude, location.longitude, alarmId]
        );
    }

    // Add location to an alarm
    static async addLocation(alarmId: number, location: Location) {
        if (!this.db) throw new Error('Local database not initialized');

        const [res] = await this.db.executeSql(
            'SELECT * FROM locations WHERE alarm_id = ?;',
            [alarmId]
        );
        if (res.rows.length > 0) throw new Error('Location already exists for this alarm');

        await this.db.executeSql(
            `INSERT INTO locations (alarm_id, address, latitude, longitude)
             VALUES (?, ?, ?, ?);`,
            [alarmId, location.address, location.latitude, location.longitude]
        );
    }

    // Get location of an alarm
    static async getLocation(alarmId: number): Promise<Location> {
        if (!this.db) throw new Error('Local database not initialized');

        const [result] = await this.db.executeSql('SELECT * FROM locations WHERE alarm_id = ?;', [alarmId]);


        if (result.rows.length < 1) {
            throw new Error('Location not found for the alarm');
        }

        return result.rows.item(0);
    }

    // Update notifying distance
    static async updateNotifyingDistance(distanceId: number, distance: number, unit: DistanceUnitsEnum) {
        if (!this.db) throw new Error('Local database not initialized');

        await this.db.executeSql(
            'UPDATE notifying_distances SET distance = ?, unit = ? WHERE id = ?;',
            [distance, unit, distanceId]
        );
    }

    // Add notifying distance to alarm
    static async addNotifyingDistance(
        alarmId: number,
        distance: number,
        unit: DistanceUnitsEnum
    ): Promise<number> {
        if (!this.db) throw new Error('Local database not initialized');

        const [result] = await this.db.executeSql(
            'INSERT INTO notifying_distances (alarm_id, distance, unit) VALUES (?, ?, ?);',
            [alarmId, distance, unit]
        );
        return result.insertId!;
    }

    // Get notifying distance
    static async getNotifyingDistance(distanceId: number): Promise<NotifyingDistance> {
        if (!this.db) throw new Error('Local database not initialized');

        const [result] = await this.db.executeSql(
            'SELECT * FROM notifying_distances WHERE id = ?;',
            [distanceId]
        );

        if (result.rows.length < 1) {
            throw new Error('Notifying distance of id was not found');
        }

        return result.rows.item(0);
    }

    // Delete notifying distance
    static async deleteNotifyingDistance(distanceId: number) {
        if (!this.db) throw new Error('Local database not initialized');

        await this.db.executeSql('DELETE FROM notifying_distances WHERE id = ?;', [distanceId]);
    }

    // Get all notifying distances of an alarm
    static async getNotifyingDistances(alarmId: number): Promise<NotifyingDistance[]> {
        if (!this.db) throw new Error('Local database not initialized');

        const [result] = await this.db.executeSql(
            'SELECT * FROM notifying_distances WHERE alarm_id = ?;',
            [alarmId]
        );

        const distances: NotifyingDistance[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            distances.push(result.rows.item(i));
        }
        return distances;
    }
}


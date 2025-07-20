// Creates alarms with data/daps/AlarmDAO and services/headless/HeadlessAlarmService (for android)

import { AlarmDAO } from "../../data/daos/AlarmDAO";
import { convertToMeters } from "../../data/helpers/UnitConverter";
import { AlarmBasic, AlarmComplete } from "../../data/models/Alarm";
// TODO: import implemented Alarm instead of tmpProtos
import { Alarm as AlarmConfigTypeAlarm, setAlarmConfig } from "./tmpProtos";

/**
 * @function getMyAlarmsList
 * @returns {Promise<AlarmBasic[]>} - A promise that resolves to a list of alarms.
 */
export async function getMyAlarmsList(): Promise<AlarmBasic[]> {
    await AlarmDAO.init();
    return await AlarmDAO.getAlarms();
}



/**
 * @function getDetailedAlarm
 * @param {number} alarmId - The ID of the alarm to retrieve.
 * @returns {Promise<AlarmComplete>} - A promise that resolves to the detailed alarm information.
 */
export async function getDetailedAlarm(alarmId: number): Promise<AlarmComplete> {
    await AlarmDAO.init();
    return await AlarmDAO.getAlarm(alarmId);
}



/**
 * @function createAlarm
 * This is unexposed function, used by saveAlarm
 * @param {AlarmComplete} alarm - The alarm data to create.
 * @returns {Promise<AlarmComplete>} - A promise that resolves to the created alarm.
 */
async function createAlarm(alarm: AlarmComplete): Promise<AlarmComplete> {
    await AlarmDAO.init();
    const newId = await AlarmDAO.addAlarm(alarm.displayName, alarm.location, alarm.notifyingDistances);
    // TODO: update whether alarm is enabled or disabled.
    return {
        ...alarm,
        alarmId: newId,
    } as AlarmComplete;
}



/**
 * @function updateAlarm
 * This is unexposed function, used by saveAlarm
 * 
 * @param {AlarmComplete} alarm - The updated alarm data.
 * @returns {Promise<AlarmComplete>} - A promise that resolves to the updated alarm.
 */
async function updateAlarm(alarm: AlarmComplete): Promise<AlarmComplete> {
    await AlarmDAO.init();
    // TODO: Implement the logic to update the alarm in the database.
    return alarm;
}


/**
 * @function regenerateLocationAlarmConfigs
 * Regenerates the location alarm configurations for all alarms active alarms.
 * This will be used by headless Alarm service
 * @see src\services\headless\HeadlessAlarmService.tsx
 * 
 * @return {Promise<void>}
 */
export async function regenerateLocationAlarmConfigs(): Promise<void> {
    await AlarmDAO.init();
    let alarms = await getMyAlarmsList();
    let activeAlarms:AlarmConfigTypeAlarm[] = [];
    const setAlarmPromises = alarms.map(async (alarm) => {
        if (!alarm.isDisabled) {
            const alarmLocation = await AlarmDAO.getLocation(alarm.alarmId);
            const myNotifiyngDistances = await AlarmDAO.getNotifyingDistances(alarm.alarmId);

            myNotifiyngDistances.forEach(notifyingDistance => {
                activeAlarms.push({
                    displayName: alarm.displayName,
                    address: alarm.address,
                    lat: alarmLocation.latitude,
                    lon: alarmLocation.longitude,
                    radius: convertToMeters(notifyingDistance.distance, notifyingDistance.unit),
                })
            })
        }
    });
    await Promise.all(setAlarmPromises);

    const alarmConfig = {
        alarms: activeAlarms,
    };
    
    await setAlarmConfig(alarmConfig);
}


/**
 * @function saveAlarm
 * if the alarm id is -1, it creates a new alarm 
 * 
 * otherwise it updates the existing alarm
 * @param {AlarmComplete} alarm - The alarm data to save.
 * @returns {Promise<AlarmComplete>} - A promise that resolves to the saved alarm.
 */
export async function saveAlarm(alarm: AlarmComplete): Promise<AlarmComplete> {
    let updatedAlarm: AlarmComplete | undefined;

    if (alarm.alarmId === -1) {
        updatedAlarm = await createAlarm(alarm);
    } else {
        updatedAlarm = await updateAlarm(alarm);
    }

    await regenerateLocationAlarmConfigs();
    
    return {...updateAlarm} as AlarmComplete;
}



/**
 * @function deleteAlarm
 * @param {number} alarmId - The ID of the alarm to delete.
 * @returns {Promise<void>} - A promise that resolves when the alarm is deleted.
 */
export async function deleteAlarm(alarmId: number): Promise<void> {
    AlarmDAO.init();
    await AlarmDAO.deleteAlarm(alarmId);
    await regenerateLocationAlarmConfigs();
}

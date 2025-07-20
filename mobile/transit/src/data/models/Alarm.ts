// For handling alarm information from database

import { Location } from './Location';
import { NotifyingDistance } from './NotifyingDistance';

export interface AlarmBasic {
    alarmId: number;
    displayName: string;
    isDisabled: boolean;
    address: string;
}

export interface AlarmComplete {
    alarmId: number;
    displayName: string;
    isDisabled: boolean;
    location: Location;
    notifyingDistances: NotifyingDistance[];
}

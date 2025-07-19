// For handling complete alarm information from database

import { Location } from './Location';
import { NotifyingDistance } from './NotifyingDistance';

export interface AlarmComplete {
    alarmId: number;
    displayName: string;
    isDisabled: boolean;
    location: Location;
    notifyingDistances: NotifyingDistance[];
}

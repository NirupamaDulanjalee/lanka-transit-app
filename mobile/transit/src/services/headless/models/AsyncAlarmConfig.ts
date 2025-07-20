// Object to set alarm config to the async storage for notifications

export type Alarm = {
    displayName: string;
    address: string;
    lat: number;
    lon: number;
    radius: number;
};

export type AlarmConfig = {
    alarms?: Alarm[];
}

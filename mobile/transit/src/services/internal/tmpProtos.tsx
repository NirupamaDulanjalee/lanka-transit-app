// TODO: Delete upon merge
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



export const setAlarmConfig = async (config: AlarmConfig) => {
};

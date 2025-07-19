// For handling notifying distances from database

export interface NotifyingDistance {
    distanceId: number;
    distance: number;
    unit: DistanceUnitsEnum;
}

export enum DistanceUnitsEnum {
    Kilometers = 'km',
    Meters = 'm',
    Feet = 'ft',
    Yards = 'yd',
}

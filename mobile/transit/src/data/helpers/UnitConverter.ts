import { DistanceUnitsEnum } from "../models/NotifyingDistance";

/**
 * convert to meters
 */
export function convertToMeters(value: number, unit: DistanceUnitsEnum): number {
    switch (unit) {
        case 'km':
            return value * 1000;
        case 'm':
            return value;
        case 'yd':
            return value * 0.9144;
        case 'ft':
            return value * 0.3048;
        default:
            throw new Error(`Unsupported unit: ${unit}`);
    }
}
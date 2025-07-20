// DTO for geocoding results from google maps
// @see https://developers.google.com/maps/documentation/geocoding/start

import { GeocodingResultDTO } from "./GeocodingResultDTO";

export interface GeoCodingResultsDTO {
    results: GeocodingResultDTO[];
    status: string;
}

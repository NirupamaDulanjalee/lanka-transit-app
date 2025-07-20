// DTO for reverse geocoding results from google maps

import { GeocodingResultDTO, PlusCode } from "./GeocodingResultDTO";

/**
 * https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
 */

 export interface ReverseGeoCodingResultsDTO {
    plus_code: PlusCode;
    results: GeocodingResultDTO[];
    status: string;
 };

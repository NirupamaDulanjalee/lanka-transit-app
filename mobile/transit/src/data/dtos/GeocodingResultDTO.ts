// DTO for geocoding results

export interface GeocodingResultDTO {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    plus_code?: PlusCode;
    types: string[];
}

export interface PlusCode {
    compound_code: string;
    global_code: string;
}
interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

interface Geometry {
    location: GeoLocation;
    location_type: string;
    viewport: Viewport;
}

interface GeoLocation {
    lat: number;
    lng: number;
}

interface Viewport {
    northeast: GeoLocation;
    southwest: GeoLocation;
}

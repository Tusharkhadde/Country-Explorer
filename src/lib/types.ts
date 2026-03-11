// src/lib/types.ts

export interface Country {
    name: string;
    officialName: string;
    code: string; // cca3 or cca2
    cca2: string;
    cca3: string;
    currencies: {
        [key: string]: {
            name: string;
            symbol: string;
        };
    };
    capital?: string[];
    region: string;
    subregion?: string;
    languages?: { [key: string]: string };
    latlng: [number, number];
    landlocked: boolean;
    borders?: string[];
    area: number;
    flag: string;
    flags: {
        png: string;
        svg: string;
        alt?: string;
    };
    population: number;
    timezones: string[];
    continents: string[];
    // Legacy mapping support
    currencyCodes?: string[];
    callingCode?: string;
    flagImageUri?: string;
    wikiDataId?: string;
    numRegions?: number;
}

export interface CountryApiResponse {
    data: Country;
}

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export interface SearchState {
    isLoading: boolean;
    error: ApiError | null;
    country: Country | null;
}
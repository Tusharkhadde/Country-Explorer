// src/lib/api.ts
import {
    getCountry as getCountryAction,
    getAllCountries as getAllCountriesAction,
    getCountriesByName as getCountriesByNameAction,
    getCountriesByCodes as getCountriesByCodesAction,
    getCountriesByCapital as getCountriesByCapitalAction,
    getCountriesByRegion as getCountriesByRegionAction,
    getCountriesBySubregion as getCountriesBySubregionAction,
    getCountriesByLanguage as getCountriesByLanguageAction,
    getCountriesByCurrency as getCountriesByCurrencyAction
} from "@/app/actions";
import { Country, ApiError } from "./types";

export async function fetchCountry(countryCode: string): Promise<Country> {
    try {
        return await getCountryAction(countryCode);
    } catch (error: unknown) {
        throw error as ApiError;
    }
}

export async function fetchAllCountries(): Promise<Country[]> {
    try {
        return await getAllCountriesAction();
    } catch (error: unknown) {
        throw error as ApiError;
    }
}

export async function fetchCountriesByName(name: string): Promise<Country[]> {
    try {
        return await getCountriesByNameAction(name);
    } catch (error: unknown) {
        throw error as ApiError;
    }
}

export async function fetchCountriesByCurrency(currency: string): Promise<Country[]> {
    try {
        return await getCountriesByCurrencyAction(currency);
    } catch (error: unknown) {
        throw error as ApiError;
    }
}

export async function fetchCountriesByLanguage(language: string): Promise<Country[]> {
    try {
        return await getCountriesByLanguageAction(language);
    } catch (error: unknown) {
        throw error as ApiError;
    }
}

export async function fetchCountriesByCapital(capital: string): Promise<Country[]> {
    try {
        return await getCountriesByCapitalAction(capital);
    } catch (error: unknown) {
        throw error as ApiError;
    }
}

export async function fetchCountriesByRegion(region: string): Promise<Country[]> {
    try {
        return await getCountriesByRegionAction(region);
    } catch (error: unknown) {
        throw error as ApiError;
    }
}

export async function fetchCountriesBySubregion(subregion: string): Promise<Country[]> {
    try {
        return await getCountriesBySubregionAction(subregion);
    } catch (error: unknown) {
        throw error as ApiError;
    }
}

export async function fetchCountriesByCodes(codes: string[]): Promise<Country[]> {
    try {
        return await getCountriesByCodesAction(codes);
    } catch (error: unknown) {
        throw error as ApiError;
    }
}

export const popularCountries = [
    { code: "USA", name: "United States" },
    { code: "GBR", name: "United Kingdom" },
    { code: "IND", name: "India" },
    { code: "JPN", name: "Japan" },
    { code: "DEU", name: "Germany" },
    { code: "FRA", name: "France" },
    { code: "CAN", name: "Canada" },
    { code: "AUS", name: "Australia" },
];
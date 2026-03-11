// src/app/actions.ts

"use server";

import { Country, ApiError } from "@/lib/types";

const BASE_URL = "https://restcountries.com/v3.1";

function mapCountry(rawCountry: any): Country {
    return {
        name: rawCountry.name?.common || "Unknown",
        officialName: rawCountry.name?.official || "",
        code: rawCountry.cca3 || "",
        cca2: rawCountry.cca2 || "",
        cca3: rawCountry.cca3 || "",
        currencies: rawCountry.currencies || {},
        capital: rawCountry.capital || [],
        region: rawCountry.region || "",
        subregion: rawCountry.subregion || "",
        languages: rawCountry.languages || {},
        latlng: rawCountry.latlng || [0, 0],
        landlocked: rawCountry.landlocked || false,
        borders: rawCountry.borders || [],
        area: rawCountry.area || 0,
        flag: rawCountry.flag || "",
        flags: rawCountry.flags || { png: "", svg: "" },
        population: rawCountry.population || 0,
        timezones: rawCountry.timezones || [],
        continents: rawCountry.continents || [],
        // Legacy compatibility
        currencyCodes: rawCountry.currencies ? Object.keys(rawCountry.currencies) : [],
        callingCode: rawCountry.idd?.root ? rawCountry.idd.root + (rawCountry.idd?.suffixes ? rawCountry.idd.suffixes[0] : "") : "",
        flagImageUri: rawCountry.flags?.png || "",
    };
}

async function fetchFromApi(endpoint: string, notFoundMessage: string): Promise<any[]> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw {
                    message: notFoundMessage,
                    code: "NOT_FOUND",
                    status: 404,
                } as ApiError;
            }
            throw {
                message: "Failed to fetch country data. Please try again later.",
                code: "API_ERROR",
                status: response.status,
            } as ApiError;
        }

        return await response.json();
    } catch (error: unknown) {
        if ((error as ApiError).code) {
            throw error;
        }
        console.error(`Fetch error for endpoint ${endpoint}:`, error);
        throw {
            message: "Network error. Please check your connection and try again.",
            code: "NETWORK_ERROR",
        } as ApiError;
    }
}

export async function getCountry(countryCode: string): Promise<Country> {
    const normalizedCode = countryCode.trim().toUpperCase();

    if (!normalizedCode || normalizedCode.length < 2 || normalizedCode.length > 3) {
        throw {
            message: "Please enter a valid country code (2-3 characters)",
            code: "INVALID_INPUT",
        } as ApiError;
    }

    const data = await fetchFromApi(`/alpha/${normalizedCode}`, `Country with code "${normalizedCode}" not found.`);
    // /alpha returns an array
    return mapCountry(data[0]);
}

export async function getAllCountries(fields?: string[]): Promise<Country[]> {
    let endpoint = "/all";
    if (fields && fields.length > 0) {
        endpoint += `?fields=${fields.join(",")}`;
    }
    const data = await fetchFromApi(endpoint, "No countries found.");
    return data.map(mapCountry);
}

export async function getCountriesByName(name: string, fullText: boolean = false): Promise<Country[]> {
    const normalizedName = name.trim();
    if (!normalizedName) {
        throw { message: "Please enter a country name.", code: "INVALID_INPUT" } as ApiError;
    }
    const endpoint = `/name/${encodeURIComponent(normalizedName)}${fullText ? "?fullText=true" : ""}`;
    const data = await fetchFromApi(endpoint, `No countries found matching name "${normalizedName}".`);
    return data.map(mapCountry);
}

export async function getCountriesByCodes(codes: string[]): Promise<Country[]> {
    if (!codes || codes.length === 0) {
        throw { message: "Please provide at least one country code.", code: "INVALID_INPUT" } as ApiError;
    }
    const endpoint = `/alpha?codes=${codes.join(",")}`;
    const data = await fetchFromApi(endpoint, `No countries found for the provided codes.`);
    return data.map(mapCountry);
}

export async function getCountriesByCapital(capital: string): Promise<Country[]> {
    const normalizedCapital = capital.trim();
    if (!normalizedCapital) {
        throw { message: "Please enter a capital name.", code: "INVALID_INPUT" } as ApiError;
    }
    const endpoint = `/capital/${encodeURIComponent(normalizedCapital)}`;
    const data = await fetchFromApi(endpoint, `No countries found with capital "${normalizedCapital}".`);
    return data.map(mapCountry);
}

export async function getCountriesByRegion(region: string): Promise<Country[]> {
    const normalizedRegion = region.trim();
    if (!normalizedRegion) {
        throw { message: "Please enter a region name.", code: "INVALID_INPUT" } as ApiError;
    }
    const endpoint = `/region/${encodeURIComponent(normalizedRegion)}`;
    const data = await fetchFromApi(endpoint, `No countries found in region "${normalizedRegion}".`);
    return data.map(mapCountry);
}

export async function getCountriesBySubregion(subregion: string): Promise<Country[]> {
    const normalizedSubregion = subregion.trim();
    if (!normalizedSubregion) {
        throw { message: "Please enter a subregion name.", code: "INVALID_INPUT" } as ApiError;
    }
    const endpoint = `/subregion/${encodeURIComponent(normalizedSubregion)}`;
    const data = await fetchFromApi(endpoint, `No countries found in subregion "${normalizedSubregion}".`);
    return data.map(mapCountry);
}

export async function getCountriesByLanguage(language: string): Promise<Country[]> {
    const normalizedLanguage = language.trim();
    if (!normalizedLanguage) {
        throw { message: "Please enter a language.", code: "INVALID_INPUT" } as ApiError;
    }
    const endpoint = `/lang/${encodeURIComponent(normalizedLanguage)}`;
    const data = await fetchFromApi(endpoint, `No countries found speaking language "${normalizedLanguage}".`);
    return data.map(mapCountry);
}

export async function getCountriesByCurrency(currency: string): Promise<Country[]> {
    const normalizedCurrency = currency.trim();
    if (!normalizedCurrency) {
        throw { message: "Please enter a currency.", code: "INVALID_INPUT" } as ApiError;
    }
    const endpoint = `/currency/${encodeURIComponent(normalizedCurrency)}`;
    const data = await fetchFromApi(endpoint, `No countries found using currency "${normalizedCurrency}".`);
    return data.map(mapCountry);
}
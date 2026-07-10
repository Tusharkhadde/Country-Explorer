// src/lib/restcountries.ts
//
// Shared client for the REST Countries v5 API (https://api.restcountries.com).
// The v5 API requires an API key and returns a normalized response shape
// wrapped in `data.objects`. This module fetches raw v5 records and maps them
// into the app's `Country` type so the rest of the app is unaffected.

import { Country, ApiError } from "@/lib/types";

const BASE_URL = "https://api.restcountries.com/countries/v5";
const API_KEY = process.env.RESTCOUNTRIES_API_KEY;

export function getAuthHeaders(): HeadersInit {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (API_KEY) {
        headers["Authorization"] = `Bearer ${API_KEY}`;
    }
    return headers;
}

// Maps a single v5 country record into the app's `Country` shape.
export function mapCountry(raw: any): Country | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const currenciesArr: any[] = raw.currencies || [];
    const currencies: { [key: string]: { name: string; symbol: string } } = {};
    const currencyCodes: string[] = [];
    for (const cur of currenciesArr) {
        if (cur && cur.code) {
            currencies[cur.code] = { name: cur.name || "", symbol: cur.symbol || "" };
            currencyCodes.push(cur.code);
        }
    }

    const languagesArr: any[] = raw.languages || [];
    const languages: { [key: string]: string } = {};
    for (const lang of languagesArr) {
        const key = lang?.bcp47 || lang?.iso639_1;
        if (key) {
            languages[key] = lang.name || "";
        }
    }

    const capitalsArr: any[] = raw.capitals || [];
    const capital: string[] = capitalsArr
        .map((cap) => (cap && typeof cap.name === "string" ? cap.name : ""))
        .filter(Boolean);

    const coords = raw.coordinates || {};
    const latlng: [number, number] = [
        typeof coords.lat === "number" ? coords.lat : 0,
        typeof coords.lng === "number" ? coords.lng : 0,
    ];

    return {
        name: raw.names?.common || "Unknown",
        officialName: raw.names?.official || "",
        code: raw.codes?.alpha_3 || "",
        cca2: raw.codes?.alpha_2 || "",
        cca3: raw.codes?.alpha_3 || "",
        currencies,
        capital,
        region: raw.region || "",
        subregion: raw.subregion || "",
        languages,
        latlng,
        landlocked: Boolean(raw.landlocked),
        borders: raw.borders || [],
        area: raw.area?.kilometers || 0,
        flag: raw.flag?.emoji || "",
        flags: {
            png: raw.flag?.url_png || "",
            svg: raw.flag?.url_svg || "",
        },
        population: raw.population || 0,
        timezones: raw.timezones || [],
        continents: raw.continents || [],
        currencyCodes,
        callingCode:
            Array.isArray(raw.calling_codes) && raw.calling_codes.length
                ? raw.calling_codes[0]
                : "",
        flagImageUri: raw.flag?.url_png || "",
    };
}

// Fetches a v5 path and returns the raw `data.objects` array.
export async function fetchObjects(path: string): Promise<any[]> {
    let response: Response;
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method: "GET",
            headers: getAuthHeaders(),
            next: { revalidate: 3600 },
        });
    } catch (error) {
        console.error(`Network error fetching ${path}:`, error);
        throw {
            message: "Network error. Please check your connection and try again.",
            code: "NETWORK_ERROR",
        } as ApiError;
    }

    if (!response.ok) {
        if (response.status === 401) {
            throw {
                message: "Unauthorized: check your REST Countries API key.",
                code: "UNAUTHORIZED",
                status: 401,
            } as ApiError;
        }
        if (response.status === 404) {
            throw {
                message: "No countries found.",
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

    const json = await response.json();
    const objects = json?.data?.objects;
    return Array.isArray(objects) ? objects : [];
}

export function mapCountries(data: any[]): Country[] {
    return data
        .map(mapCountry)
        .filter((country): country is Country => country !== null);
}

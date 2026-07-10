// src/app/actions.ts

"use server";

import { Country, ApiError } from "@/lib/types";
import { fetchObjects, mapCountries, mapCountry } from "@/lib/restcountries";

// Throws NOT_FOUND when the v5 response contains no objects.
async function fetchRequired(path: string, notFoundMessage: string): Promise<any[]> {
    const objects = await fetchObjects(path);
    if (objects.length === 0) {
        throw {
            message: notFoundMessage,
            code: "NOT_FOUND",
            status: 404,
        } as ApiError;
    }
    return objects;
}

export async function getCountry(countryCode: string): Promise<Country> {
    const normalizedCode = countryCode.trim().toUpperCase();

    if (!normalizedCode || normalizedCode.length < 2 || normalizedCode.length > 3) {
        throw {
            message: "Please enter a valid country code (2-3 characters)",
            code: "INVALID_INPUT",
        } as ApiError;
    }

    let objects = await fetchObjects(`/codes.alpha_3/${normalizedCode}`);
    if (objects.length === 0) {
        objects = await fetchObjects(`/codes.alpha_2/${normalizedCode}`);
    }

    if (objects.length === 0) {
        throw {
            message: `Country with code "${normalizedCode}" not found.`,
            code: "NOT_FOUND",
            status: 404,
        } as ApiError;
    }

    const country = mapCountry(objects[0]);
    if (!country) {
        throw {
            message: `Country with code "${normalizedCode}" not found.`,
            code: "NOT_FOUND",
            status: 404,
        } as ApiError;
    }
    return country;
}

export async function getAllCountries(_fields?: string[]): Promise<Country[]> {
    const objects = await fetchObjects("/");
    return mapCountries(objects);
}

export async function getCountriesByName(name: string, _fullText: boolean = false): Promise<Country[]> {
    const normalizedName = name.trim();
    if (!normalizedName) {
        throw { message: "Please enter a country name.", code: "INVALID_INPUT" } as ApiError;
    }
    const objects = await fetchRequired(
        `/?q=${encodeURIComponent(normalizedName)}`,
        `No countries found matching name "${normalizedName}".`
    );
    return mapCountries(objects);
}

export async function getCountriesByCodes(codes: string[]): Promise<Country[]> {
    if (!codes || codes.length === 0) {
        throw { message: "Please provide at least one country code.", code: "INVALID_INPUT" } as ApiError;
    }

    const results = await Promise.all(
        codes.map((code) =>
            fetchObjects(`/codes.alpha_3/${code.trim().toUpperCase()}`).catch(() => [])
        )
    );

    return mapCountries(results.flat());
}

export async function getCountriesByCapital(capital: string): Promise<Country[]> {
    const normalizedCapital = capital.trim();
    if (!normalizedCapital) {
        throw { message: "Please enter a capital name.", code: "INVALID_INPUT" } as ApiError;
    }
    const objects = await fetchRequired(
        `/capitals/${encodeURIComponent(normalizedCapital)}`,
        `No countries found with capital "${normalizedCapital}".`
    );
    return mapCountries(objects);
}

export async function getCountriesByRegion(region: string): Promise<Country[]> {
    const normalizedRegion = region.trim();
    if (!normalizedRegion) {
        throw { message: "Please enter a region name.", code: "INVALID_INPUT" } as ApiError;
    }
    const objects = await fetchRequired(
        `/region/${encodeURIComponent(normalizedRegion)}`,
        `No countries found in region "${normalizedRegion}".`
    );
    return mapCountries(objects);
}

export async function getCountriesBySubregion(subregion: string): Promise<Country[]> {
    const normalizedSubregion = subregion.trim();
    if (!normalizedSubregion) {
        throw { message: "Please enter a subregion name.", code: "INVALID_INPUT" } as ApiError;
    }
    const objects = await fetchRequired(
        `/subregion/${encodeURIComponent(normalizedSubregion)}`,
        `No countries found in subregion "${normalizedSubregion}".`
    );
    return mapCountries(objects);
}

export async function getCountriesByLanguage(language: string): Promise<Country[]> {
    const normalizedLanguage = language.trim();
    if (!normalizedLanguage) {
        throw { message: "Please enter a language.", code: "INVALID_INPUT" } as ApiError;
    }
    const objects = await fetchRequired(
        `/languages/${encodeURIComponent(normalizedLanguage)}`,
        `No countries found speaking language "${normalizedLanguage}".`
    );
    return mapCountries(objects);
}

export async function getCountriesByCurrency(currency: string): Promise<Country[]> {
    const normalizedCurrency = currency.trim();
    if (!normalizedCurrency) {
        throw { message: "Please enter a currency.", code: "INVALID_INPUT" } as ApiError;
    }
    const objects = await fetchRequired(
        `/currencies/${encodeURIComponent(normalizedCurrency)}`,
        `No countries found using currency "${normalizedCurrency}".`
    );
    return mapCountries(objects);
}

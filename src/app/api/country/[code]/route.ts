// src/app/api/country/[code]/route.ts

import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://restcountries.com/v3.1";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;

    // Validate country code
    if (!code || code.length < 2 || code.length > 3) {
        return NextResponse.json(
            {
                error: {
                    message: "Please enter a valid country code (2-3 characters)",
                    code: "INVALID_INPUT",
                },
            },
            { status: 400 }
        );
    }

    const normalizedCode = code.toUpperCase();

    try {
        const response = await fetch(`${BASE_URL}/alpha/${normalizedCode}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    {
                        error: {
                            message: `Country with code "${normalizedCode}" not found. Please try a valid ISO country code.`,
                            code: "NOT_FOUND",
                            status: 404,
                        },
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                {
                    error: {
                        message: "Failed to fetch country data. Please try again later.",
                        code: "API_ERROR",
                        status: response.status,
                    },
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        const rawCountry = data[0];

        // Map to our unified format
        const country = {
            name: rawCountry.name.common,
            officialName: rawCountry.name.official,
            code: rawCountry.cca3,
            cca2: rawCountry.cca2,
            cca3: rawCountry.cca3,
            currencies: rawCountry.currencies,
            capital: rawCountry.capital,
            region: rawCountry.region,
            subregion: rawCountry.subregion,

            languages: rawCountry.languages,
            latlng: rawCountry.latlng,
            landlocked: rawCountry.landlocked,
            borders: rawCountry.borders,
            area: rawCountry.area,
            flag: rawCountry.flag,
            flags: rawCountry.flags,
            population: rawCountry.population,
            timezones: rawCountry.timezones,
            continents: rawCountry.continents,
            // Legacy compatibility
            currencyCodes: rawCountry.currencies ? Object.keys(rawCountry.currencies) : [],
            callingCode: rawCountry.idd?.root + (rawCountry.idd?.suffixes ? rawCountry.idd.suffixes[0] : ""),
            flagImageUri: rawCountry.flags?.png,
        };

        return NextResponse.json({ data: country });
    } catch (error) {
        console.error("Error fetching country data:", error);
        return NextResponse.json(
            {
                error: {
                    message: "Network error. Please check your connection and try again.",
                    code: "NETWORK_ERROR",
                },
            },
            { status: 500 }
        );
    }
}
// src/app/api/country/[code]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { fetchObjects, mapCountry } from "@/lib/restcountries";

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
        let objects = await fetchObjects(`/codes.alpha_3/${normalizedCode}`);
        if (objects.length === 0) {
            objects = await fetchObjects(`/codes.alpha_2/${normalizedCode}`);
        }

        if (objects.length === 0) {
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

        const country = mapCountry(objects[0]);

        if (!country) {
            return NextResponse.json(
                {
                    error: {
                        message: `Country with code "${normalizedCode}" not found.`,
                        code: "NOT_FOUND",
                        status: 404,
                    },
                },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: country });
    } catch (error: unknown) {
        const apiError = error as { code?: string; status?: number; message?: string };
        if (apiError.code === "NETWORK_ERROR") {
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
        if (apiError.code === "UNAUTHORIZED") {
            return NextResponse.json(
                {
                    error: {
                        message: "Unauthorized: check your REST Countries API key.",
                        code: "UNAUTHORIZED",
                    },
                },
                { status: 401 }
            );
        }
        console.error("Error fetching country data:", error);
        return NextResponse.json(
            {
                error: {
                    message: "Failed to fetch country data. Please try again later.",
                    code: "API_ERROR",
                    status: apiError.status ?? 500,
                },
            },
            { status: apiError.status ?? 500 }
        );
    }
}

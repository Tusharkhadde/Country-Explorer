// src/app/language/page.tsx

"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CountryCard } from "@/components/CountryCard";
import { LoadingCard } from "@/components/LoadingCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { WorldMap } from "@/components/map";
import { fetchCountriesByLanguage } from "@/lib/api";
import { Country, ApiError } from "@/lib/types";

export default function LanguagePage() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [lastSearch, setLastSearch] = useState<string | null>(null);

    const handleSearch = useCallback(async (query: string) => {
        setIsLoading(true);
        setError(null);
        setCountries([]);
        setLastSearch(query);

        try {
            const data = await fetchCountriesByLanguage(query);
            setCountries(data);
        } catch (err: unknown) {
            setError(err as ApiError);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleRetry = useCallback(() => {
        if (lastSearch) {
            handleSearch(lastSearch);
        }
    }, [lastSearch, handleSearch]);

    const languages = [
        { label: "English", value: "English" },
        { label: "Spanish", value: "Spanish" },
        { label: "French", value: "French" },
        { label: "Arabic", value: "Arabic" },
        { label: "Portuguese", value: "Portuguese" },
        { label: "Mandarin", value: "Mandarin" },
        { label: "Hindi", value: "Hindi" },
    ];

    const languageMapConnections = [
        { start: { lat: 40, lng: -3, label: "Spanish" }, end: { lat: -20, lng: -60, label: "South America" } },
        { start: { lat: 51, lng: -0.1, label: "English" }, end: { lat: -25, lng: 135, label: "Oceania" } },
        { start: { lat: 46, lng: 2, label: "French" }, end: { lat: 0, lng: 20, label: "Africa" } },
        { start: { lat: 39, lng: 116, label: "Mandarin" }, end: { lat: 1, lng: 103, label: "Singapore" } },
        { start: { lat: 24, lng: 46, label: "Arabic" }, end: { lat: 30, lng: 31, label: "Egypt" } },
    ];

    // Generate dynamic connections between countries to show on the map
    const dynamicConnections = React.useMemo(() => {
        if (!countries || countries.length < 2) return [];

        // For visual appeal, we'll create sequential connections
        // Let's create connections between up to 15 countries to avoid clutter
        const maxCountries = Math.min(countries.length, 15);
        const connections = [];

        for (let i = 0; i < maxCountries - 1; i++) {
            const current = countries[i];
            const next = countries[i + 1];

            if (current.latlng && next.latlng) {
                connections.push({
                    start: { lat: current.latlng[0], lng: current.latlng[1], label: current.name },
                    end: { lat: next.latlng[0], lng: next.latlng[1], label: next.name },
                });
            }
        }

        // Connect the last to the first to create a loop
        if (maxCountries >= 3 && countries[maxCountries - 1].latlng && countries[0].latlng) {
            connections.push({
                start: { lat: countries[maxCountries - 1].latlng[0], lng: countries[maxCountries - 1].latlng[1], label: countries[maxCountries - 1].name },
                end: { lat: countries[0].latlng[0], lng: countries[0].latlng[1], label: countries[0].name },
            });
        }

        return connections;
    }, [countries]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Animated background pattern */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent rounded-full blur-3xl" />
            </div>

            <Header />

            <main className="container mx-auto px-4 py-8 md:py-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium mb-6"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Explore By Spoken Language
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Search by <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">Language</span>
                    </h1>
                </motion.div>

                <div className="mb-12 flex justify-center w-full">
                    <SearchBar
                        onSearch={handleSearch}
                        isLoading={isLoading}
                        placeholder="Enter a spoken language (e.g. Spanish, English)..."
                        suggestions={languages}
                        suggestionsTitle="Popular languages:"
                    />
                </div>

                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center">
                            <LoadingCard />
                        </motion.div>
                    )}
                    {error && !isLoading && (
                        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center">
                            <ErrorMessage error={error} onRetry={handleRetry} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {countries.length === 0 && !isLoading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full max-w-5xl mx-auto mt-8"
                    >
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-semibold mb-2">Language Connections</h3>
                            <p className="text-muted-foreground">Search for a language to see where it&apos;s spoken</p>
                        </div>
                        <WorldMap dots={languageMapConnections} lineColor="#a855f7" />
                    </motion.div>
                )}

                {countries.length > 0 && !isLoading && !error && (
                    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto">
                        {/* Dynamic Connections Map */}
                        {dynamicConnections.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full max-w-5xl mx-auto mb-8 relative"
                            >
                                <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm">
                                    <p className="text-sm font-medium">
                                        <span className="text-purple-500 mr-2">●</span>
                                        Language Connections: {lastSearch}
                                    </p>
                                </div>
                                <div className="rounded-2xl overflow-hidden border border-border/50 shadow-xl">
                                    <WorldMap dots={dynamicConnections} lineColor="#a855f7" />
                                </div>
                            </motion.div>
                        )}

                        {/* Country Cards Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {countries.map((country, index) => (
                                    <motion.div
                                        key={country.code}
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        <CountryCard country={country} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

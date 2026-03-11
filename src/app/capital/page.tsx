// src/app/capital/page.tsx

"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2 } from "lucide-react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CountryCard } from "@/components/CountryCard";
import { LoadingCard } from "@/components/LoadingCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { fetchCountriesByCapital } from "@/lib/api";
import { Country, ApiError } from "@/lib/types";

export default function CapitalPage() {
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
            const data = await fetchCountriesByCapital(query);
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

    const capitals = [
        { label: "Tokyo", value: "Tokyo" },
        { label: "London", value: "London" },
        { label: "Paris", value: "Paris" },
        { label: "Washington, D.C.", value: "Washington" },
        { label: "Beijing", value: "Beijing" },
        { label: "New Delhi", value: "New Delhi" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Animated background pattern */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-orange-500/5 via-transparent to-transparent rounded-full blur-3xl" />
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6"
                    >
                        <Building2 className="h-4 w-4" />
                        Explore By Capital
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Search by <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">Capital City</span>
                    </h1>
                </motion.div>

                <div className="mb-12 flex justify-center w-full">
                    <SearchBar
                        onSearch={handleSearch}
                        isLoading={isLoading}
                        placeholder="Enter a capital city name..."
                        suggestions={capitals}
                        suggestionsTitle="Popular capitals:"
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

                {countries.length > 0 && !isLoading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
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
                )}
            </main>
        </div>
    );
}

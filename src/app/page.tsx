// src/app/page.tsx

"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CountryCard } from "@/components/CountryCard";
import { LoadingCard } from "@/components/LoadingCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import {
    fetchCountry,
    fetchCountriesByName,
    fetchCountriesByCodes,
    popularCountries
} from "@/lib/api";
import { Country, ApiError } from "@/lib/types";

export default function HomePage() {
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
            let data: Country[] = [];
            // Basic heuristic: if it looks like a code list, search by codes,
            // if it's 2-3 chars, try code first then name,
            // otherwise, search by name.
            if (query.includes(",")) {
                data = await fetchCountriesByCodes(query.split(",").map(c => c.trim()));
            } else if (query.length <= 3) {
                try {
                    data = [await fetchCountry(query)];
                } catch {
                    // Fallback to name search if code fails
                    data = await fetchCountriesByName(query);
                }
            } else {
                data = await fetchCountriesByName(query);
            }
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

    const suggestions = popularCountries.map(c => ({ label: c.code, value: c.code }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Animated background pattern */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl" />
            </div>

            <Header />

            <main className="container mx-auto px-4 py-8 md:py-16">
                {/* Hero Section */}
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                    >
                        <Sparkles className="h-4 w-4" />
                        Explore 250+ Countries
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                            Discover the
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                            World&apos;s Countries
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Search for any country globally securely by its common name, official name, or strict ISO code.
                    </motion.p>
                </motion.div>

                {/* Search Bar */}
                <div className="mb-12 flex justify-center w-full">
                    <SearchBar
                        onSearch={handleSearch}
                        isLoading={isLoading}
                        placeholder="Enter country name or ISO code..."
                        suggestions={suggestions}
                        suggestionsTitle="Popular country codes:"
                    />
                </div>

                {/* Results Section for Errors & Loading */}
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center"
                        >
                            <LoadingCard />
                        </motion.div>
                    )}

                    {error && !isLoading && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center"
                        >
                            <ErrorMessage error={error} onRetry={handleRetry} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grid of Results */}
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

                {/* Empty State */}
                {countries.length === 0 && !isLoading && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center py-16"
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-6"
                        >
                            <Globe2 className="h-12 w-12 text-muted-foreground" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">Start Exploring</h3>
                        <p className="text-muted-foreground">
                            Enter a search query above to get started
                        </p>
                    </motion.div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t mt-auto">
                <div className="container flex justify-between mx-auto px-4 py-6 text-sm text-muted-foreground">
                    <p>Built with Next.js, TypeScript, and shadcn/ui</p>
                    <p>
                        Data provided by{" "}
                        <a
                            href="https://restcountries.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            REST Countries API
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
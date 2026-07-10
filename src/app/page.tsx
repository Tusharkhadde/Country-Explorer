// src/app/page.tsx

"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe2,
    Sparkles,
    Map,
    MapPin,
    Coins,
    Languages,
    ArrowRight,
    Search,
    Database,
    Zap,
    ShieldCheck,
    Github,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CountryCard } from "@/components/CountryCard";
import { LoadingCard } from "@/components/LoadingCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
    fetchCountry,
    fetchCountriesByName,
    fetchCountriesByCodes,
    popularCountries,
} from "@/lib/api";
import { Country, ApiError } from "@/lib/types";

const features = [
    {
        href: "/region",
        icon: Map,
        title: "Region Explorer",
        description:
            "Browse every country across continents and subregions on an interactive world map.",
    },
    {
        href: "/capital",
        icon: MapPin,
        title: "Capital Search",
        description:
            "Jump straight to any nation by typing its capital city — fast and fuzzy matched.",
    },
    {
        href: "/currency",
        icon: Coins,
        title: "Currency Lookup",
        description:
            "Discover which countries share a currency, from the Euro to the Japanese yen.",
    },
    {
        href: "/language",
        icon: Languages,
        title: "Language Finder",
        description:
            "Find every place on Earth where a language is spoken as an official tongue.",
    },
];

const stats = [
    { value: "250+", label: "Countries & territories" },
    { value: "5", label: "Ways to explore" },
    { value: "0ms", label: "Client-side search" },
    { value: "100%", label: "Open data powered" },
];

const highlights = [
    {
        icon: Zap,
        title: "Instant, fuzzy search",
        description:
            "Type a name, code, capital, currency or language and watch live autocomplete surface matches as you go.",
    },
    {
        icon: Database,
        title: "Rich country profiles",
        description:
            "Flags, capitals, populations, currencies, languages, regions and more — sourced from the REST Countries API.",
    },
    {
        icon: ShieldCheck,
        title: "Fast & accessible",
        description:
            "Built on Next.js with smooth animations, keyboard navigation and a fully themeable light/dark UI.",
    },
];

export default function HomePage() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [lastSearch, setLastSearch] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = useCallback(async (query: string) => {
        setIsLoading(true);
        setError(null);
        setCountries([]);
        setLastSearch(query);
        setHasSearched(true);

        try {
            let data: Country[] = [];
            if (query.includes(",")) {
                data = await fetchCountriesByCodes(
                    query.split(",").map((c) => c.trim())
                );
            } else if (query.length <= 3) {
                try {
                    data = [await fetchCountry(query)];
                } catch {
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

    const suggestions = popularCountries.map((c) => ({
        label: c.code,
        value: c.code,
    }));

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <Header />

            {/* Ambient gradient background */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
                <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
                <div className="absolute right-[-10rem] top-40 h-[28rem] w-[28rem] rounded-full bg-muted-foreground/5 blur-3xl" />
                <div className="absolute left-[-8rem] top-80 h-96 w-96 rounded-full bg-muted/60 blur-3xl" />
            </div>

            <main>
                {/* Hero */}
                <section className="container mx-auto px-4 pb-16 pt-16 md:pb-24 md:pt-28">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", delay: 0.15 }}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur"
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            Explore 250+ countries, instantly
                        </motion.div>

                        <h1 className="mt-6 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-4xl font-bold leading-[1.05] tracking-tight text-transparent md:text-6xl">
                            Discover the world&apos;s
                            <br />
                            countries in seconds
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground"
                        >
                            Search any nation by name, capital, currency, language
                            or region. Beautiful profiles, live data, zero friction.
                        </motion.p>
                    </motion.div>

                    {/* Search */}
                    <div className="mt-10">
                        <SearchBar
                            onSearch={handleSearch}
                            isLoading={isLoading}
                            placeholder="Search a country, capital or currency..."
                            suggestions={suggestions}
                            suggestionsTitle="Try a popular code:"
                        />
                    </div>

                    {/* Live results */}
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="mt-12 flex justify-center"
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
                                className="mt-12 flex justify-center"
                            >
                                <ErrorMessage
                                    error={error}
                                    onRetry={handleRetry}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {countries.length > 0 && !isLoading && !error && (
                        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
                            <AnimatePresence>
                                {countries.map((country, index) => (
                                    <motion.div
                                        key={country.code}
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.05,
                                        }}
                                    >
                                        <CountryCard country={country} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {!hasSearched && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-14 flex flex-col items-center gap-4 text-center"
                        >
                            <span className="text-sm font-medium text-muted-foreground">
                                Or explore by category
                            </span>
                            <div className="flex flex-wrap justify-center gap-3">
                                {features.map((f) => (
                                    <Button
                                        key={f.href}
                                        variant="outline"
                                        asChild
                                        className="group"
                                    >
                                        <Link href={f.href}>
                                            <f.icon className="mr-2 h-4 w-4" />
                                            {f.title.split(" ")[0]}
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </section>

                {/* Stats band */}
                <section className="border-y border-border bg-card/40">
                    <div className="container mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className="text-center"
                            >
                                <div className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className="container mx-auto px-4 py-20 md:py-28">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto max-w-2xl text-center"
                    >
                        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                            Five ways to explore
                        </span>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                            One explorer, every angle
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Whether you think in capitals, currencies or cultures,
                            Country Explorer meets you where you are.
                        </p>
                    </motion.div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.href}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.45 }}
                            >
                                <Link
                                    href={feature.href}
                                    className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                                >
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="flex items-center gap-1 text-lg font-semibold">
                                        {feature.title}
                                        <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Highlights */}
                <section className="border-t border-border bg-card/40">
                    <div className="container mx-auto px-4 py-20 md:py-28">
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-3">
                            {highlights.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.45 }}
                                    className="text-center"
                                >
                                    <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-foreground to-muted-foreground p-10 text-center text-primary-foreground md:p-16"
                    >
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-20"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25), transparent 45%)",
                            }}
                        />
                        <div className="relative">
                            <Globe2 className="mx-auto h-10 w-10" />
                            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                                Start exploring the world
                            </h2>
                            <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
                                It&apos;s free, fast and powered by open data. Pick a
                                country and dive in.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    asChild
                                    className="gap-2"
                                >
                                    <Link href="/region">
                                        <Search className="h-4 w-4" />
                                        Explore by region
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    asChild
                                    className="gap-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                >
                                    <a
                                        href="https://github.com/Tusharkhadde/Country-Explorer"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Github className="h-4 w-4" />
                                        View source
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
                    <p className="flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-primary" />
                        Built with Next.js, TypeScript, and shadcn/ui
                    </p>
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

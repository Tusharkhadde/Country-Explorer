// src/components/SearchBar.tsx

"use client";

import React, {
    useState,
    useCallback,
    useMemo,
    useRef,
    useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Sparkles, MapPin, Coins, Globe2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchAllCountriesForAutocomplete } from "@/lib/api";
import { Country } from "@/lib/types";

export interface SearchSuggestion {
    label: string;
    value: string;
}

interface AutoItem {
    country: Country;
    hint: string;
    matchType: "name" | "capital" | "currency" | "region" | "language";
}

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
    placeholder: string;
    suggestions?: SearchSuggestion[];
    suggestionsTitle?: string;
    maxLength?: number;
}

function buildHint(country: Country, query: string): AutoItem | null {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const name = (country.name || "").toLowerCase();
    const official = (country.officialName || "").toLowerCase();
    const capitals = (country.capital || []).map((c) => c.toLowerCase());
    const currencies = country.currencies || {};
    const currencyKeys = Object.keys(currencies).map((k) => k.toLowerCase());
    const currencyNames = Object.values(currencies)
        .map((c) => (c?.name || "").toLowerCase())
        .filter(Boolean);
    const region = (country.region || "").toLowerCase();
    const languages = Object.values(country.languages || {}).map((l) =>
        (l || "").toLowerCase()
    );

    if (name.includes(q) || official.includes(q)) {
        const capital = country.capital?.[0];
        return {
            country,
            hint: capital ? `Capital: ${capital}` : country.region,
            matchType: "name",
        };
    }
    const matchedCapital = capitals.find((c) => c.includes(q));
    if (matchedCapital) {
        return {
            country,
            hint: `Capital: ${matchedCapital}`,
            matchType: "capital",
        };
    }
    if (
        currencyKeys.some((k) => k.includes(q)) ||
        currencyNames.some((n) => n.includes(q))
    ) {
        const symbol =
            Object.values(currencies)
                .map((c) => c?.symbol)
                .find(Boolean) || "";
        return {
            country,
            hint: `Currency${symbol ? ` (${symbol})` : ""}`,
            matchType: "currency",
        };
    }
    if (region.includes(q)) {
        return { country, hint: `Region: ${country.region}`, matchType: "region" };
    }
    if (languages.some((l) => l.includes(q))) {
        return { country, hint: `Language`, matchType: "language" };
    }
    return null;
}

export function SearchBar({
    onSearch,
    isLoading,
    placeholder,
    suggestions = [],
    suggestionsTitle = "Suggestions:",
    maxLength = 100,
}: SearchBarProps) {
    const [searchValue, setSearchValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [allCountries, setAllCountries] = useState<Country[]>([]);
    const [loadingAuto, setLoadingAuto] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const containerRef = useRef<HTMLFormElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const ensureCountriesLoaded = useCallback(async () => {
        if (allCountries.length > 0) return;
        setLoadingAuto(true);
        try {
            const data = await fetchAllCountriesForAutocomplete();
            setAllCountries(data);
        } catch {
            // ignore - autocomplete simply won't show
        } finally {
            setLoadingAuto(false);
        }
    }, [allCountries.length]);

    const matches = useMemo<AutoItem[]>(() => {
        const q = searchValue.trim();
        if (!q || allCountries.length === 0) return [];
        const result: AutoItem[] = [];
        for (const country of allCountries) {
            const item = buildHint(country, q);
            if (item) {
                result.push(item);
                if (result.length >= 8) break;
            }
        }
        return result;
    }, [searchValue, allCountries]);

    const showDropdown = isFocused && searchValue.trim().length > 0;
    const hasMatches = matches.length > 0;

    const handleChange = useCallback(
        (value: string) => {
            setSearchValue(value);
            setActiveIndex(-1);
            if (value.trim()) {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => {
                    ensureCountriesLoaded();
                }, 150);
            }
        },
        [ensureCountriesLoaded]
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const q = searchValue.trim();
            if (q) {
                setIsFocused(false);
                onSearch(q);
            }
        },
        [searchValue, onSearch]
    );

    const handleQuickSearch = useCallback(
        (value: string) => {
            setSearchValue(value);
            setIsFocused(false);
            onSearch(value);
        },
        [onSearch]
    );

    const selectMatch = useCallback(
        (item: AutoItem) => {
            // Search by the country's name so the result is accurate
            handleQuickSearch(item.country.name);
        },
        [handleQuickSearch]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!showDropdown || !hasMatches) return;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => (i + 1) % matches.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => (i - 1 + matches.length) % matches.length);
            } else if (e.key === "Enter" && activeIndex >= 0) {
                e.preventDefault();
                selectMatch(matches[activeIndex]);
            } else if (e.key === "Escape") {
                setIsFocused(false);
            }
        },
        [showDropdown, hasMatches, matches, activeIndex, selectMatch]
    );

    const matchIcon = (type: AutoItem["matchType"]) => {
        if (type === "capital") return <MapPin className="h-3.5 w-3.5" />;
        if (type === "currency") return <Coins className="h-3.5 w-3.5" />;
        return <Globe2 className="h-3.5 w-3.5" />;
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-3xl mx-auto space-y-6"
        >
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="relative" ref={containerRef}>
                <motion.div
                    className={`relative rounded-2xl transition-all duration-300 flex-1 bg-background ${
                        isFocused
                            ? "border border-border ring-2 ring-foreground/10"
                            : "border border-border"
                    }`}
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Search className="h-5 w-5" />
                    </div>
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={(e) => handleChange(e.target.value)}
                        onFocus={() => {
                            setIsFocused(true);
                            ensureCountriesLoaded();
                        }}
                        onBlur={() => {
                            // delay to allow click on dropdown item
                            setTimeout(() => setIsFocused(false), 120);
                        }}
                        onKeyDown={handleKeyDown}
                        maxLength={maxLength}
                        autoComplete="off"
                        className="h-14 pl-12 pr-32 text-base sm:text-lg rounded-2xl border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button
                            type="submit"
                            disabled={isLoading || !searchValue.trim()}
                            className="h-10 px-6 rounded-xl"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Search"
                            )}
                        </Button>
                    </div>
                </motion.div>

                {/* Live Autocomplete Dropdown */}
                <AnimatePresence>
                    {showDropdown && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-xl"
                        >
                            {loadingAuto && matches.length === 0 ? (
                                <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading suggestions...
                                </div>
                            ) : hasMatches ? (
                                <ul className="max-h-80 overflow-y-auto py-1">
                                    {matches.map((item, index) => (
                                        <li key={item.country.code || item.country.cca3 || index}>
                                            <button
                                                type="button"
                                                onMouseEnter={() => setActiveIndex(index)}
                                                onClick={() => selectMatch(item)}
                                                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                                    activeIndex === index
                                                        ? "bg-accent"
                                                        : "hover:bg-accent/60"
                                                }`}
                                            >
                                                {item.country.flags?.png ? (
                                                    <img
                                                        src={item.country.flags.png}
                                                        alt=""
                                                        className="h-5 w-7 rounded-sm object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-base">
                                                        {item.country.flag}
                                                    </span>
                                                )}
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                    <span className="truncate font-medium">
                                                        {item.country.name}
                                                    </span>
                                                    <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                                                        {matchIcon(item.matchType)}
                                                        {item.hint}
                                                    </span>
                                                </div>
                                                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {item.matchType}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="px-4 py-3 text-sm text-muted-foreground">
                                    No matches. Press Enter to search by name.
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

            {/* Quick Search Suggestions */}
            {suggestions.length > 0 && !showDropdown && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        <span>{suggestionsTitle}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {suggestions.map((suggestion, index) => (
                                <motion.div
                                    key={suggestion.value}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.05 }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer px-3 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
                                        onClick={() => handleQuickSearch(suggestion.value)}
                                    >
                                        {suggestion.label}
                                    </Badge>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

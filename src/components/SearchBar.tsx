// src/components/SearchBar.tsx

"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface SearchSuggestion {
    label: string;
    value: string;
}

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
    placeholder: string;
    suggestions?: SearchSuggestion[];
    suggestionsTitle?: string;
    maxLength?: number;
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

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (searchValue.trim()) {
                onSearch(searchValue.trim());
            }
        },
        [searchValue, onSearch]
    );

    const handleQuickSearch = useCallback(
        (value: string) => {
            setSearchValue(value);
            onSearch(value);
        },
        [onSearch]
    );

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-3xl mx-auto space-y-6"
        >
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="relative">
                <motion.div
                    className={`relative rounded-2xl transition-all duration-300 flex-1 ${isFocused
                            ? "ring-2 ring-primary/50 shadow-lg shadow-primary/10"
                            : "shadow-md"
                        }`}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Search className="h-5 w-5" />
                    </div>
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        maxLength={maxLength}
                        className="h-14 pl-12 pr-32 text-base sm:text-lg rounded-2xl border-0 bg-card/80 backdrop-blur-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button
                            type="submit"
                            disabled={isLoading || !searchValue.trim()}
                            className="h-10 px-6 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Search"
                            )}
                        </Button>
                    </div>
                </motion.div>
            </form>

            {/* Quick Search Suggestions */}
            {suggestions.length > 0 && (
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
// src/components/CountryCard.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    MapPin,
    Phone,
    Coins,
    Map,
    Globe,
    ExternalLink,
    Copy,
    Check,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Country } from "@/lib/types";
import { formatCallingCode, formatCurrencyCodes } from "@/lib/utils";

interface CountryCardProps {
    country: Country;
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    delay: number;
}

function InfoItem({ icon, label, value, delay }: InfoItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200 group"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold truncate">{value}</p>
            </div>
        </motion.div>
    );
}

export function CountryCard({ country }: CountryCardProps) {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
            }}
            className="w-full max-w-2xl mx-auto"
        >
            <Card className="overflow-hidden border-0 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-shadow duration-300">
                {/* Header with gradient */}
                <CardHeader className="relative pb-8 pt-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg"
                            >
                                {country.code}
                            </motion.div>
                            <div>
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl sm:text-3xl font-bold"
                                >
                                    {country.name}
                                </motion.h2>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center gap-2 mt-1"
                                >
                                    <Badge variant="secondary" className="font-mono">
                                        ISO: {country.code}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => copyToClipboard(country.code)}
                                    >
                                        {copied ? (
                                            <Check className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </div>

                        {country.wikiDataId && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button variant="outline" size="sm" className="gap-2" asChild>
                                    <a
                                        href={`https://www.wikidata.org/wiki/${country.wikiDataId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Globe className="h-4 w-4" />
                                        WikiData
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-6 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InfoItem
                            icon={<Phone className="h-6 w-6" />}
                            label="Calling Code"
                            value={formatCallingCode(country.callingCode || "")}
                            delay={0.3}
                        />
                        <InfoItem
                            icon={<Coins className="h-6 w-6" />}
                            label="Currency"
                            value={formatCurrencyCodes(country.currencyCodes || [])}
                            delay={0.4}
                        />
                        <InfoItem
                            icon={<Map className="h-6 w-6" />}
                            label="Number of Regions"
                            value={country.numRegions || "N/A"}
                            delay={0.5}
                        />
                        <InfoItem
                            icon={<MapPin className="h-6 w-6" />}
                            label="Country Code"
                            value={country.code}
                            delay={0.6}
                        />
                    </div>

                    {/* Currency Badges */}
                    {country.currencyCodes && country.currencyCodes.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="mt-6 pt-6 border-t"
                        >
                            <p className="text-sm text-muted-foreground mb-3">
                                Accepted Currencies
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {country.currencyCodes.map((currency, index) => (
                                    <motion.div
                                        key={currency}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                    >
                                        <Badge
                                            variant="outline"
                                            className="px-4 py-2 text-base font-semibold hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                                        >
                                            {currency}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
// src/components/LoadingCard.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl mx-auto"
        >
            <Card className="overflow-hidden border-0 bg-card/80 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-8 pt-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                            >
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
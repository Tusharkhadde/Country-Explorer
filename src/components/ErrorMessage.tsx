// src/components/ErrorMessage.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/types";

interface ErrorMessageProps {
    error: ApiError;
    onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
    const getErrorIcon = () => {
        switch (error.code) {
            case "NOT_FOUND":
                return <Search className="h-5 w-5" />;
            default:
                return <AlertCircle className="h-5 w-5" />;
        }
    };

    const getErrorTitle = () => {
        switch (error.code) {
            case "NOT_FOUND":
                return "Country Not Found";
            case "INVALID_INPUT":
                return "Invalid Input";
            case "NETWORK_ERROR":
                return "Network Error";
            default:
                return "Something Went Wrong";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-2xl mx-auto"
        >
            <Alert
                variant="destructive"
                className="border-destructive/50 bg-destructive/10 backdrop-blur-xl"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                >
                    {getErrorIcon()}
                </motion.div>
                <AlertTitle className="text-lg font-semibold">
                    {getErrorTitle()}
                </AlertTitle>
                <AlertDescription className="mt-2">
                    <p className="text-muted-foreground">{error.message}</p>
                    {onRetry && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 gap-2"
                                onClick={onRetry}
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>
                        </motion.div>
                    )}
                </AlertDescription>
            </Alert>

            {/* Helpful tips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground"
            >
                <p className="font-medium mb-2">💡 Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Use standard 2-letter ISO country codes (e.g., US, GB, IN)</li>
                    <li>Country codes are case-insensitive</li>
                    <li>Check your internet connection if the error persists</li>
                </ul>
            </motion.div>
        </motion.div>
    );
}
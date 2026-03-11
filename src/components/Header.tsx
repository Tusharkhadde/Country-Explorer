// src/components/Header.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe2, Github, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/region", label: "Region" },
    { href: "/capital", label: "Capital" },
    { href: "/language", label: "Language" },
    { href: "/currency", label: "Currency" },
];

export function Header() {
    const pathname = usePathname();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-2">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                            <SheetHeader>
                                <SheetTitle className="text-left font-bold flex items-center gap-2">
                                    <Globe2 className="h-5 w-5 text-primary" />
                                    Explorer
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-4 mt-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-lg font-medium transition-colors hover:text-primary ${pathname === link.href
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Globe2 className="h-8 w-8 text-primary" />
                    </motion.div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hidden sm:inline-block">
                        Country Explorer
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 flex-1 ml-4 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition-colors hover:text-primary ${pathname === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
        </motion.header>
    );
}
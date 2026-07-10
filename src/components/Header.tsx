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

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <motion.header
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-1">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[260px] sm:w-[300px]">
                            <SheetHeader>
                                <SheetTitle className="text-left font-bold flex items-center gap-2">
                                    <Globe2 className="h-5 w-5 text-primary" />
                                    Country Explorer
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-2 mt-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-primary ${isActive(link.href)
                                            ? "bg-accent/60 text-primary"
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
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-1.5"
                    >
                        <Globe2 className="h-7 w-7 text-primary" />
                    </motion.div>
                    <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">
                        Country<span className="text-primary">Explorer</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1 flex-1 ml-2 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative rounded-md px-3 py-2 transition-colors hover:text-primary ${isActive(link.href)
                                ? "text-primary"
                                : "text-muted-foreground"
                                }`}
                        >
                            {link.label}
                            {isActive(link.href) && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hidden sm:inline-flex"
                    >
                        <a
                            href="https://github.com/Tusharkhadde/Country-Explorer"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
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

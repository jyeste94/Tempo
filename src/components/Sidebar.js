"use client";

import { LogOut, Home, User, CheckCircle2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside className={cn(
                "w-64 border-r bg-card flex flex-col h-screen fixed top-0 left-0 pt-6 z-50 transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "lg:translate-x-0"
            )}>
                <div className="px-6 pb-6 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-bold text-xl">
                        <CheckCircle2 className="w-6 h-6" />
                        Tempo
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button className="lg:hidden text-muted-foreground p-1" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-4 flex flex-col gap-2">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">
                        <Home className="w-5 h-5" />
                        Day Plan
                    </button>
                </div>

                <div className="p-4 border-t">
                    {user && (
                        <div className="mb-4 px-4">
                            <p className="text-sm font-medium truncate">{user.email}</p>
                            <p className="text-xs text-muted-foreground">Logged in</p>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}

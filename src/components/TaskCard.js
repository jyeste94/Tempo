"use client";

import { motion } from "framer-motion";
import { format, isWithinInterval, parse } from "date-fns";
import { Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function TaskCard({ task, onUpdate, onRemove }) {
    const [isCurrent, setIsCurrent] = useState(false);

    useEffect(() => {
        const checkCurrent = () => {
            try {
                const now = new Date();
                const currentDateString = format(now, "yyyy-MM-dd");

                // Parse the start and end times assuming they refer to today
                const start = parse(`${currentDateString} ${task.startTime}`, "yyyy-MM-dd HH:mm", new Date());
                const end = parse(`${currentDateString} ${task.endTime}`, "yyyy-MM-dd HH:mm", new Date());

                const active = isWithinInterval(now, { start, end });
                setIsCurrent(active);
            } catch (err) {
                setIsCurrent(false);
            }
        };

        checkCurrent();
        const interval = setInterval(checkCurrent, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [task.startTime, task.endTime]);

    const categoryColors = {
        work: "border-blue-200/50 dark:border-blue-900/50 hover:border-blue-500",
        health: "border-emerald-200/50 dark:border-emerald-900/50 hover:border-emerald-500",
        leisure: "border-amber-200/50 dark:border-amber-900/50 hover:border-amber-500",
        default: "border-border hover:border-foreground/30"
    };

    const categoryBg = {
        work: "bg-blue-500/5",
        health: "bg-emerald-500/5",
        leisure: "bg-amber-500/5",
        default: "bg-card"
    };

    const currentCategoryColor = categoryColors[task.category] || categoryColors.default;
    const currentCategoryBg = categoryBg[task.category] || categoryBg.default;

    const handleToggleCompletion = () => {
        if (onUpdate) {
            onUpdate(task.id, { isCompleted: !task.isCompleted });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            className={cn(
                "relative p-4 rounded-xl border flex items-center gap-4 transition-all shadow-sm group",
                currentCategoryBg,
                currentCategoryColor,
                isCurrent && !task.isCompleted && "ring-1 ring-primary/50 !bg-primary/5",
                task.isOverlapping && !task.isCompleted && "border-destructive ring-1 ring-destructive/50",
                task.isCompleted && "opacity-50 grayscale"
            )}
        >
            <button
                onClick={handleToggleCompletion}
                className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    task.isCompleted ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 hover:border-primary/50 text-transparent hover:text-primary/30"
                )}
            >
                <CheckCircle className="w-4 h-4" />
            </button>

            <div className="w-16 flex-shrink-0 text-center">
                <div className="text-sm font-bold text-foreground">{task.startTime}</div>
                <div className="text-xs text-muted-foreground">{task.endTime}</div>
            </div>

            <div className="h-full w-1 bg-border rounded-full self-stretch my-1" />

            <div className="flex-1 min-w-0">
                <h4 className={cn("text-base font-semibold truncate transition-colors",
                    task.isCompleted ? "text-muted-foreground line-through" :
                        isCurrent ? "text-primary" : "text-foreground"
                )}>
                    {task.description}
                </h4>
                {task.isOverlapping && !task.isCompleted && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> Horario solapado
                    </p>
                )}
            </div>

            <button
                onClick={() => onRemove(task.id)}
                className="text-muted-foreground hover:text-destructive opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-destructive/10"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {isCurrent && (
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full ring-4 ring-background" />
            )}
        </motion.div>
    );
}

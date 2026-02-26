"use client";

import { motion } from "framer-motion";
import { format, isWithinInterval, parse } from "date-fns";
import { Trash2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function TaskCard({ task, onRemove }) {
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            className={cn(
                "relative p-4 rounded-xl border bg-card flex items-center gap-4 transition-all shadow-sm group",
                isCurrent && "border-primary ring-1 ring-primary/50 bg-primary/5",
                task.isOverlapping && "border-destructive ring-1 ring-destructive/50"
            )}
        >
            <div className="w-16 flex-shrink-0 text-center">
                <div className="text-sm font-bold text-foreground">{task.startTime}</div>
                <div className="text-xs text-muted-foreground">{task.endTime}</div>
            </div>

            <div className="h-full w-1 bg-border rounded-full self-stretch my-1" />

            <div className="flex-1 min-w-0">
                <h4 className={cn("text-base font-semibold truncate", isCurrent ? "text-primary" : "text-foreground")}>
                    {task.description}
                </h4>
                {task.isOverlapping && (
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

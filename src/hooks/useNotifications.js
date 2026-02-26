"use client";

import { useEffect, useRef } from "react";
import { parse, differenceInMinutes } from "date-fns";

export function useNotifications(tasks) {
    const notifiedTasksRef = useRef(new Set());

    // Request permissions on mount
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "default") {
                Notification.requestPermission();
            }
        }
    }, []);

    useEffect(() => {
        if (!tasks || tasks.length === 0) return;
        if (typeof window === "undefined" || !("Notification" in window)) return;
        if (Notification.permission !== "granted") return;

        const checkUpcomingTasks = () => {
            const now = new Date();
            const currentDateString = "2000-01-01"; // Base date for time math

            tasks.forEach(task => {
                // Ignore completed tasks
                if (task.isCompleted) return;

                try {
                    const start = parse(`${currentDateString} ${task.startTime}`, "yyyy-MM-dd HH:mm", now);
                    const diff = differenceInMinutes(start, now);

                    // If task starts in exactly 5 minutes (or between 4 and 5)
                    // and we haven't notified for this specific task ID yet
                    if (diff === 5 && !notifiedTasksRef.current.has(task.id)) {
                        new Notification("Tempo - Próxima Tarea", {
                            body: `En 5 minutos: ${task.description}`,
                            icon: "/favicon.ico", // Ensure we have a favicon
                        });
                        notifiedTasksRef.current.add(task.id);
                    }
                } catch (e) {
                    // Ignore math errors
                }
            });
        };

        // Check immediately
        checkUpcomingTasks();

        // Then check every minute
        const intervalId = setInterval(checkUpcomingTasks, 60000);

        return () => clearInterval(intervalId);
    }, [tasks]);
}

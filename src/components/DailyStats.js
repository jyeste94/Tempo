"use client";

import { useMemo } from "react";
import { parse, differenceInMinutes } from "date-fns";
import { Clock, Briefcase, Activity, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function DailyStats({ tasks }) {
    const stats = useMemo(() => {
        let totalMinutes = 0;
        let workMinutes = 0;
        let healthMinutes = 0;
        let leisureMinutes = 0;

        const now = new Date();
        const currentDateString = "2000-01-01"; // arbitrary date just for time math

        tasks.forEach(task => {
            try {
                const start = parse(`${currentDateString} ${task.startTime}`, "yyyy-MM-dd HH:mm", now);
                const end = parse(`${currentDateString} ${task.endTime}`, "yyyy-MM-dd HH:mm", now);

                const mins = differenceInMinutes(end, start);
                if (mins > 0) {
                    totalMinutes += mins;
                    if (task.category === "work") workMinutes += mins;
                    if (task.category === "health") healthMinutes += mins;
                    if (task.category === "leisure") leisureMinutes += mins;
                }
            } catch (e) {
                // ignore parsing errors silently
            }
        });

        const formatTime = (mins) => {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            if (h === 0) return `${m}m`;
            if (m === 0) return `${h}h`;
            return `${h}h ${m}m`;
        };

        return {
            total: formatTime(totalMinutes),
            work: formatTime(workMinutes),
            health: formatTime(healthMinutes),
            leisure: formatTime(leisureMinutes),
        };
    }, [tasks]);

    if (tasks.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Día</p>
                        <p className="text-xl font-bold">{stats.total}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Trabajo</p>
                        <p className="text-xl font-bold">{stats.work}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Salud</p>
                        <p className="text-xl font-bold">{stats.health}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                        <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Ocio</p>
                        <p className="text-xl font-bold">{stats.leisure}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

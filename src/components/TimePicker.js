"use client";

import { Input } from "@/components/ui/input";

export function TimePicker({ value, onChange, label }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-muted-foreground">
                {label}
            </label>
            <Input
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full"
                required
            />
        </div>
    );
}

"use client";

import { Button } from "@/components/ui/button";

const TAGS = [
    { label: "Gym 🏋️", value: "Gym 🏋️" },
    { label: "Comida 🥗", value: "Comida 🥗" },
    { label: "Trabajo 💻", value: "Trabajo 💻" },
    { label: "Descanso ☕", value: "Descanso ☕" },
];

export function QuickTags({ onSelect }) {
    return (
        <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
                <Button
                    key={tag.value}
                    variant="secondary"
                    className="rounded-full text-xs font-medium px-4 h-8"
                    onClick={() => onSelect(tag.value)}
                >
                    {tag.label}
                </Button>
            ))}
        </div>
    );
}

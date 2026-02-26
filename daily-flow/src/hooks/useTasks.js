"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load from local storage on mount or when user changes
    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const storedTasks = localStorage.getItem(`daily_flow_tasks_${user.uid}`);
            if (storedTasks) {
                const parsed = JSON.parse(storedTasks);
                // Sort chronologically
                parsed.sort((a, b) => a.startTime.localeCompare(b.startTime));
                setTasks(addOverlapFlags(parsed));
            } else {
                setTasks([]);
            }
        } catch (err) {
            console.error("Error reading localStorage:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Helper to detect overlaps
    const addOverlapFlags = (taskList) => {
        return taskList.map((task, index) => {
            let isOverlapping = false;
            if (index > 0) {
                const prevTask = taskList[index - 1];
                if (task.startTime < prevTask.endTime) {
                    isOverlapping = true;
                }
            }
            return { ...task, isOverlapping };
        });
    };

    // Helper to persist to localStorage
    const saveTasks = (newTasks) => {
        if (!user) return;
        newTasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
        const validatedTasks = addOverlapFlags(newTasks);
        setTasks(validatedTasks);
        localStorage.setItem(`daily_flow_tasks_${user.uid}`, JSON.stringify(validatedTasks));
    };

    const addTask = async (taskData) => {
        if (!user) throw new Error("Must be logged in to add a task");
        const newTask = {
            ...taskData,
            id: crypto.randomUUID(), // Generate a unique ID
            createdAt: new Date().toISOString(),
        };
        saveTasks([...tasks, newTask]);
    };

    const updateTask = async (taskId, updates) => {
        if (!user) return;
        const newTasks = tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
        saveTasks(newTasks);
    };

    const removeTask = async (taskId) => {
        if (!user) return;
        const newTasks = tasks.filter((t) => t.id !== taskId);
        saveTasks(newTasks);
    };

    return { tasks, loading, error, addTask, updateTask, removeTask };
}

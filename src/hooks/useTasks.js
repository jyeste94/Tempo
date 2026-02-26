"use client";

import { useState, useEffect } from "react";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const q = query(
            collection(db, "tasks"),
            where("userId", "==", user.uid),
            orderBy("startTime", "asc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const tasksData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Validation of Overlap
                const validatedTasks = addOverlapFlags(tasksData);
                setTasks(validatedTasks);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching tasks:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
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

    const addTask = async (taskData) => {
        if (!user) throw new Error("Must be logged in to add a task");
        try {
            await addDoc(collection(db, "tasks"), {
                ...taskData,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error adding task:", err);
            throw err;
        }
    };

    const updateTask = async (taskId, updates) => {
        try {
            const taskRef = doc(db, "tasks", taskId);
            await updateDoc(taskRef, updates);
        } catch (err) {
            console.error("Error updating task:", err);
            throw err;
        }
    };

    const removeTask = async (taskId) => {
        try {
            await deleteDoc(doc(db, "tasks", taskId));
        } catch (err) {
            console.error("Error removing task:", err);
            throw err;
        }
    };

    return { tasks, loading, error, addTask, updateTask, removeTask };
}

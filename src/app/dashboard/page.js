"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { Sidebar } from "@/components/Sidebar";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { QuickTags } from "@/components/QuickTags";
import { TimePicker } from "@/components/TimePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Menu, CheckCircle2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function DashboardPage() {
    const { tasks, loading, addTask, removeTask } = useTasks();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!startTime || !endTime || !description) return;

        try {
            setIsSubmitting(true);
            await addTask({ startTime, endTime, description });
            setDescription("");
            setStartTime("");
            setEndTime("");
        } catch (err) {
            console.error("Failed to add task", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickTag = (tagText) => {
        setDescription((prev) => (prev ? `${prev} ${tagText}` : tagText));
    };

    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-background text-foreground">

                {/* Sidebar (Responsive) */}
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* Main Content Area */}
                <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-12 xl:max-w-5xl mx-auto w-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between lg:hidden mb-6 pb-4 border-b">
                        <div className="flex items-center gap-2 text-primary font-bold text-xl">
                            <CheckCircle2 className="w-6 h-6" />
                            Tempo
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>

                    <header className="mb-6 lg:mb-8">
                        <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl mb-1 lg:mb-2">Mi Día</h1>
                        <p className="text-muted-foreground text-lg">Organiza y visualiza tu flujo de trabajo.</p>
                    </header>

                    {/* Add Task Form */}
                    <div className="bg-card border rounded-2xl p-6 shadow-sm mb-10">
                        <form onSubmit={handleAddTask} className="flex flex-col gap-6">

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-3">
                                    <TimePicker label="Hora Inicio" value={startTime} onChange={setStartTime} />
                                </div>
                                <div className="md:col-span-3">
                                    <TimePicker label="Hora Fin" value={endTime} onChange={setEndTime} />
                                </div>
                                <div className="md:col-span-4 flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground">Descripción</label>
                                    <Input
                                        placeholder="E.g., Revisar correos..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PlusCircle className="w-4 h-4 mr-2" /> Añadir</>}
                                    </Button>
                                </div>
                            </div>

                            {/* Quick Tags row */}
                            <div className="flex items-center gap-3 border-t pt-4">
                                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Insertar rápido:</span>
                                <QuickTags onSelect={handleQuickTag} />
                            </div>
                        </form>
                    </div>

                    {/* Tasks List */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            Línea de Tiempo
                            <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {tasks.length} tareas
                            </span>
                        </h3>

                        {loading ? (
                            <div className="flex justify-center p-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center p-12 border-2 border-dashed rounded-2xl bg-muted/20">
                                <p className="text-muted-foreground">Tu día está libre. Añade tu primera tarea arriba.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 relative">
                                <AnimatePresence>
                                    {tasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onRemove={removeTask}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, User, Lock, Mail } from "lucide-react";

export default function LoginPage() {
    const { user, loginWithGoogle, loginWithEmail, registerWithEmail, authError } = useAuth();
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Sync global auth error
    useEffect(() => {
        if (authError) setError(authError);
    }, [authError]);

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isRegistering) {
                await registerWithEmail(email, password);
            } else {
                await loginWithEmail(email, password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await loginWithGoogle();
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Tempo</h1>
                    <p className="text-muted-foreground text-sm">
                        Organiza tu día de forma minimalista
                    </p>
                </div>

                <Card className="border-border shadow-xl">
                    <CardHeader>
                        <CardTitle>{isRegistering ? "Crear una cuenta" : "Iniciar Sesión"}</CardTitle>
                        <CardDescription>
                            {isRegistering
                                ? "Introduce tus datos para registrarte"
                                : "Accede a tu panel de tareas diario"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20 text-center">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="Correo electrónico"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Contraseña"
                                        className="pl-9"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Procesando..." : isRegistering ? "Registrarse" : "Entrar"}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            type="button"
                            className="w-full bg-background"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Google
                        </Button>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    {isRegistering ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="underline underline-offset-4 hover:text-primary transition-colors font-medium"
                    >
                        {isRegistering ? "Inicia sesión" : "Regístrate"}
                    </button>
                </p>
            </div>
        </div>
    );
}

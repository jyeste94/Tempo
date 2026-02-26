"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getRedirectResult } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Handle redirect result
        console.log("Checking redirect result...");
        getRedirectResult(auth).then((result) => {
            console.log("Redirect Result:", result);
        }).catch((error) => {
            console.error("Firebase Redirect Error:", error);
            setAuthError(error.message);
        });

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth State Changed. User:", currentUser ? currentUser.email : "null");
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        return signInWithRedirect(auth, provider);
    };

    const loginWithEmail = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const registerWithEmail = async (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        return signOut(auth);
    };

    const value = {
        user,
        loading,
        authError,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

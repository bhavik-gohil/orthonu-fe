"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiCall } from "./api-client";
import { useRouter } from "next/navigation";
import { getShopUrl } from "./subdomains";

interface User {
    id: number;
    uid: string;
    name: string;
    email: string;
    userType: "regular" | "professional";
    status: string;
    profession?: string;
    npiNumber?: string;
    // Shipping address
    fullName?: string;
    phone?: string;
    streetAddress1?: string;
    streetAddress2?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
    // Billing address
    isBillingSameAsShipping?: boolean;
    billingNameOnCard?: string;
    billingStreetAddress1?: string;
    billingStreetAddress2?: string;
    billingCity?: string;
    billingState?: string;
    billingCountry?: string;
    billingZipcode?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<any>;
    register: (data: any) => Promise<any>;
    logout: (redirectPath?: string) => Promise<void>;
    refreshUser: () => Promise<void>;
    verifyOtp: (data: { email: string, code: string, type: 'registration' | 'admin_login' }) => Promise<any>;
    resendOtp: (data: { email: string, type: 'registration' | 'admin_login' }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: async (redirectPath?: string) => { },
    refreshUser: async () => { },
    verifyOtp: async () => { },
    resendOtp: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchMe = useCallback(async () => {
        try {
            console.log("Fetching current user...");
            const data = await apiCall("GET", "/auth/me");
            console.log("Current user fetched:", data);
            setUser(data);
        } catch (err) {
            console.log("No active user session found.");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    const login = async (credentials: any) => {
        console.log("Attempting login...");
        const data = await apiCall("POST", "/auth/login", credentials);
        if (data.user) {
            console.log("Login success, user data:", data.user);
            setUser(data.user);
        }
        return data;
    };

    const register = async (userData: any) => {
        console.log("Registering user...");
        const data = await apiCall("POST", "/auth/register", userData);
        // Only auto-login if verified and active
        if (data.user && data.user.isVerified && data.user.status === 'active') {
            console.log("Registration success, auto-logging in:", data.user);
            setUser(data.user);
        }
        return data;
    };

    const verifyOtp = async (otpData: { email: string, code: string, type: 'registration' | 'admin_login' }) => {
        return await apiCall("POST", "/auth/verify-otp", otpData);
    };

    const resendOtp = async (otpData: { email: string, type: 'registration' | 'admin_login' }) => {
        return await apiCall("POST", "/auth/resend-otp", otpData);
    };

    const logout = async (redirectPath: string = getShopUrl()) => {
        console.log("Logging out...");
        await apiCall("POST", "/auth/logout");
        setUser(null);
        console.log("Logged out successfully.");

        // Redirect to the provided path or default to /shop
        router.push(redirectPath);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            register, 
            logout, 
            refreshUser: fetchMe,
            verifyOtp,
            resendOtp
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

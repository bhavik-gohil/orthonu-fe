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
    extendSession: () => Promise<void>;
    verifyOtp: (data: { email: string, code: string, type: 'registration' | 'admin_login' | 'password_reset' }) => Promise<any>;
    resendOtp: (data: { email: string, type: 'registration' | 'admin_login' | 'password_reset' }) => Promise<any>;
    forgotPassword: (email: string) => Promise<any>;
    resetPassword: (data: { token: string, newPassword: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: async (redirectPath?: string) => { },
    refreshUser: async () => { },
    extendSession: async () => { },
    verifyOtp: async () => { },
    resendOtp: async () => { },
    forgotPassword: async () => { },
    resetPassword: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [isExtending, setIsExtending] = useState(false);
    const router = useRouter();

    const fetchMe = useCallback(async () => {
        try {
            // AuthContext only handles shop user sessions.
            // Admin session verification is handled by AdminLayout separately.
            const data = await apiCall("GET", "/auth/me");
            setUser(data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    // Listen for session expiration events from api-client
    useEffect(() => {
        const handleSessionExpired = () => {
            // Only show for admin users or if in admin path
            const isAdminPath = window.location.pathname.startsWith("/admin");
            if (isAdminPath) {
                setShowSessionModal(true);
            }
        };

        window.addEventListener("session-expired", handleSessionExpired);
        return () => window.removeEventListener("session-expired", handleSessionExpired);
    }, []);

    const extendSession = async () => {
        try {
            setIsExtending(true);
            const data = await apiCall("POST", "/admin/refresh-session");
            if (data.user) {
                setUser(data.user);
                setShowSessionModal(false);
            }
        } catch (err) {
            console.error("Failed to extend session:", err);
            // If refresh fails, redirect to login directly (don't call logout() to avoid infinite loop)
            setUser(null);
            setShowSessionModal(false);
            router.push("/admin/login");
        } finally {
            setIsExtending(false);
        }
    };

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

    const verifyOtp = async (otpData: { email: string, code: string, type: 'registration' | 'admin_login' | 'password_reset' }) => {
        return await apiCall("POST", "/auth/verify-otp", otpData);
    };

    const resendOtp = async (otpData: { email: string, type: 'registration' | 'admin_login' | 'password_reset' }) => {
        return await apiCall("POST", "/auth/resend-otp", otpData);
    };

    const forgotPassword = async (email: string) => {
        return await apiCall("POST", "/auth/forgot-password", { email });
    };

    const resetPassword = async (data: { token: string, newPassword: string }) => {
        return await apiCall("POST", "/auth/reset-password", data);
    };

    const logout = async (redirectPath: string = getShopUrl()) => {
        const isAdminPath = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
        const url = isAdminPath ? "/admin/logout" : "/auth/logout";
        
        try {
            await apiCall("POST", url);
        } catch (err) {
            // Gracefully handle — server may be down or token already invalid
        }
        setUser(null);
        setShowSessionModal(false);
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
            extendSession,
            verifyOtp,
            resendOtp,
            forgotPassword,
            resetPassword
        }}>
            {children}

            {/* Session Expiry Modal */}
            {showSessionModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-zinc-100 text-center space-y-6 transform animate-in slide-in-from-bottom-4 duration-500">
                        <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-10 h-10 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-soft-dark tracking-tight">Session Expired</h2>
                            <p className="text-zinc-500 font-medium">Your session has timed out due to inactivity. Would you like to stay logged in?</p>
                        </div>
                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={extendSession}
                                disabled={isExtending}
                                className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-atlantic-blue transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
                            >
                                {isExtending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Extending...
                                    </>
                                ) : (
                                    "Stay Logged In"
                                )}
                            </button>
                            <button
                                onClick={() => logout()}
                                className="w-full py-4 text-zinc-400 font-bold hover:text-soft-dark transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

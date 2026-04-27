"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Loader2, ShieldCheck, Mail } from "lucide-react";

interface OtpVerificationProps {
    email: string;
    type: 'registration' | 'admin_login' | 'password_reset';
    onSuccess: (data: any) => void;
    onBack: () => void;
}

export default function OtpVerification({ email, type, onSuccess, onBack }: OtpVerificationProps) {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isSuccess, setIsSuccess] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { verifyOtp, resendOtp } = useAuth();

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move to next input
        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(data)) return;

        const newOtp = [...otp];
        data.split("").forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);

        // Focus the last input or the next empty one
        const nextIndex = data.length < 6 ? data.length : 5;
        inputRefs.current[nextIndex]?.focus();
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const code = otp.join("");
        if (code.length < 6) return;

        setLoading(true);
        setError("");
        try {
            const data = await verifyOtp({ email, code, type });
            setIsSuccess(true);
            // Wait 1.5 seconds before redirecting
            setTimeout(() => {
                onSuccess(data);
            }, 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Invalid or expired code.");
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setResendLoading(true);
        try {
            await resendOtp({ email, type });
            setTimer(60);
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to resend code. Please try again.");
        } finally {
            setResendLoading(false);
        }
    };

    // Auto-submit when all digits are filled
    useEffect(() => {
        if (otp.join("").length === 6 && !isSuccess) {
            handleSubmit();
        }
    }, [otp, isSuccess]);

    return (
        <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in duration-300 relative overflow-hidden">
            <div className={`flex flex-col items-center text-center space-y-4 bg-white p-8 rounded-3xl transition-all duration-500 ${isSuccess ? "scale-95 opacity-50 blur-sm pointer-events-none" : ""}`}>
                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue">
                    <ShieldCheck size={32} />
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-soft-dark">Verify Your Email</h2>
                    <p className="text-sm text-soft-dark/60">
                        We've sent a 6-digit code to <br />
                        <span className="font-semibold text-soft-dark">{email}</span>
                    </p>
                </div>

                <div className="flex gap-2 py-4" onPaste={handlePaste}>
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={(el) => { inputRefs.current[index] = el }}
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-14 text-center text-xl font-bold bg-warm-gray rounded-xl border-2 border-transparent focus:border-brand-blue focus:bg-white outline-none transition-all"
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-sm font-medium text-rose-500 animate-pulse">
                        {error}
                    </p>
                )}

                <div className="w-full space-y-4">
                    <button
                        onClick={() => handleSubmit()}
                        disabled={loading || otp.join("").length < 6}
                        className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-atlantic-blue hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Continue"}
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={handleResend}
                            disabled={timer > 0 || resendLoading}
                            className={`text-sm font-semibold transition-colors ${timer > 0 ? "text-zinc-400 cursor-not-allowed" : "text-brand-blue hover:text-atlantic-blue"}`}
                        >
                            {resendLoading ? (
                                <Loader2 className="animate-spin inline mr-2" size={14} />
                            ) : null}
                            Resend Code {timer > 0 ? `in ${timer}s` : ""}
                        </button>
                        
                        <button
                            onClick={onBack}
                            className="text-sm font-medium text-zinc-500 hover:text-soft-dark transition-colors"
                        >
                            Back to {type === 'registration' ? 'Registration' : type === 'password_reset' ? 'Password Reset' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Overlay */}
            {isSuccess && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] animate-in fade-in zoom-in-95 duration-300 rounded-3xl">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200 animate-bounce">
                        <ShieldCheck size={40} />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-soft-dark">Verified!</h3>
                    <p className="text-sm text-soft-dark/60 mt-2">Redirecting you shortly...</p>
                </div>
            )}
        </div>
    );
}

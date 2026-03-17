"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Terminal } from "lucide-react";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/admin");
            } else {
                const data = await res.json();
                setError(data.error || "Authentication failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 relative z-10">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                            <ShieldAlert className="w-8 h-8 text-accent" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center font-bold tracking-tight text-white">
                        Recuvix Admin
                    </CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Enter the secret key to access the control panel
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-accent"
                                required
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full bg-accent hover:bg-accent/90 text-black font-bold h-11"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Login to Dashboard"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <div className="absolute bottom-6 flex items-center gap-2 text-zinc-600 text-xs">
                <Terminal className="w-3 h-3" />
                <span>Authorized Personnel Only</span>
            </div>
        </div>
    );
}

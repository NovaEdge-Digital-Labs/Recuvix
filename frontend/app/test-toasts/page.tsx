"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function TestToastsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-[#0a0a0a] text-white p-10 font-sans">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-bold font-syne text-[#e8ff47]">Toast System Verification</h1>
                <p className="text-white/50 font-outfit">Click the buttons below to trigger different toast notifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
                <Button
                    onClick={() => toast.success("Success Toast Triggered", { description: "This is a success message for verification." })}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold h-12"
                >
                    Success Toast
                </Button>
                <Button
                    onClick={() => toast.error("Error Toast Triggered", { description: "This is an error message for verification." })}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold h-12"
                >
                    Error Toast
                </Button>
                <Button
                    onClick={() => toast.warning("Warning Toast Triggered", { description: "This is a warning message for verification." })}
                    className="bg-[#e8ff47] hover:bg-[#d8ef37] text-black font-bold h-12"
                >
                    Warning Toast
                </Button>
            </div>

            <div className="mt-10 p-6 border border-white/10 rounded-2xl bg-white/5 max-w-lg w-full">
                <h2 className="text-lg font-bold font-syne mb-2">Checklist:</h2>
                <ul className="space-y-2 text-sm font-outfit text-white/70">
                    <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-white/20"></span>
                        Appears in the bottom-right corner.
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-white/20"></span>
                        Has dark background (#0d0d0d).
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-white/20"></span>
                        Correct accent border (Green/Red/Yellow).
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-white/20"></span>
                        Uses "Outfit" font.
                    </li>
                </ul>
            </div>
        </div>
    );
}

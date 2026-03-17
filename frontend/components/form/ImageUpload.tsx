"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    label: string;
    description?: string;
    value: string | null;
    onChange: (url: string | null) => void;
    type: 'logo' | 'userImage' | 'colorTheme';
    className?: string;
}

export function ImageUpload({ label, description, value, onChange, type, className }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleUpload(e.dataTransfer.files[0]);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = useCallback(async (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            alert("Only JPG, PNG, and WebP formats are supported");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const res = await fetch(`${backendUrl}/api/upload/assets`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            if (data.url) {
                onChange(data.url);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }, [onChange, type]);

    return (
        <div className={cn("space-y-2", className)}>
            <label className="block text-sm font-medium text-foreground">{label}</label>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}

            {value ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border bg-card group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Uploaded" className="w-full h-full object-cover transition-opacity group-hover:opacity-50" />
                    <button
                        onClick={() => onChange(null)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors bg-card hover:bg-card/80",
                        isDragging ? "border-accent bg-accent/5" : "border-border",
                        isUploading ? "opacity-50 pointer-events-none" : ""
                    )}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-accent" />
                            <span className="text-xs text-muted-foreground">Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 py-4">
                            <div className="p-2 bg-background border border-border rounded-full">
                                <UploadCloud size={20} className="text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-[10px] text-muted-foreground/70">JPG, PNG, WebP (max 5MB)</p>
                        </div>
                    )}
                    <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleChange} disabled={isUploading} />
                </label>
            )}
        </div>
    );
}

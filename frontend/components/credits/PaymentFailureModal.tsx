"use client";

import { AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PaymentFailureModalProps {
    isOpen: boolean;
    onClose: () => void;
    error?: string;
}

export function PaymentFailureModal({ isOpen, onClose, error }: PaymentFailureModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center justify-center pt-6">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center">Payment Failed</DialogTitle>
                    <DialogDescription className="text-center text-slate-600">
                        {error || "We couldn't process your payment. Please try again or contact your bank."}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 mt-2 text-center rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm text-red-700 flex items-center justify-center gap-2">
                        <AlertCircle size={14} />
                        No credits were deducted from your bank.
                    </p>
                </div>

                <DialogFooter className="sm:justify-center mt-6 flex gap-2">
                    <Button variant="outline" onClick={onClose} className="w-full">
                        Close
                    </Button>
                    <Button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white">
                        Try Again
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

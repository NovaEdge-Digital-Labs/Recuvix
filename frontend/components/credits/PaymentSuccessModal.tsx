"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    creditsAdded: number;
}

export function PaymentSuccessModal({ isOpen, onClose, creditsAdded }: PaymentSuccessModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center justify-center pt-6">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center">Payment Successful!</DialogTitle>
                    <DialogDescription className="text-center text-slate-600">
                        {creditsAdded} credits have been added to your account.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 mt-2 text-center rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-sm text-slate-600 font-medium">New Balance</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">Ready to Generate</p>
                </div>

                <DialogFooter className="sm:justify-center mt-6">
                    <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
                        Start Generating
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

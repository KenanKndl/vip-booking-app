import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "VIP Booking App",
    description: "Premium reservation and booking experience.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" className={cn("h-full antialiased scroll-smooth", figtree.variable)}>
        <body className="min-h-full bg-[#0d0d0d] font-sans text-foreground overflow-x-hidden">
        {children}
        </body>
        </html>
    );
}
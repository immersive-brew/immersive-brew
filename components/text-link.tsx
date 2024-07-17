"use client";
import Link from "next/link";

export function TextLink({ href, children, ...props }: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            color="blue"
            className="font-bold hover:underline text-foreground/80 display:flex align-items:center gap-1"
        >
            {children}
        </Link>
    );
}

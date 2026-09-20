"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { DocsSidebarContent } from "@/components/docs/sidebar";
import { cn } from "@/lib/utils";

const siteNavItems = [
  { title: "Home", href: "/" },
  { title: "Download", href: "/download" },
  { title: "Pricing", href: "/pricing" },
  { title: "Docs", href: "/docs" },
  { title: "Blog", href: "/blog" },
  { title: "Support", href: "/support" },
];

export function DocsMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100]">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={close}
              aria-hidden="true"
            />
          <div className="absolute inset-y-0 left-0 flex w-[85vw] max-w-xs flex-col overflow-y-auto border-r bg-background p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Menu</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <DocsSidebarContent onNavigate={close} />

            <div className="mt-8 border-t pt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Site
              </p>
              <nav className="space-y-1">
                {siteNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
                <a
                  href="https://github.com/snhsish/crosscode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </div>
          </div>,
          document.body
        )}
    </div>
  );
}

import { DocsSidebar } from "@/components/docs/sidebar";
import { DocsMobileNav } from "@/components/docs/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";

const siteNavItems = [
  { title: "Home", href: "/" },
  { title: "Download", href: "/download" },
  { title: "Pricing", href: "/pricing" },
  { title: "Docs", href: "/docs" },
  { title: "Blog", href: "/blog" },
  { title: "Support", href: "/support" },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1">
            <DocsMobileNav />
            <Link href="/" className="flex items-center" aria-label="CrossCode home">
              <BrandLogo />
            </Link>
          </div>
          <nav className="hidden items-center gap-6 lg:flex">
            {siteNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
            <a
              href="https://github.com/snhsish/crosscode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="container flex items-start">
        <DocsSidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden break-words px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

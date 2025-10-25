import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Fiyatlandırma" },
  { href: "/docs", label: "Doküman" },
];

export default function Navbar() {
  return (
    <header className="border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          PolicyCompare
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="rounded-lg border px-3 py-1 font-medium">
            Giriş Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}

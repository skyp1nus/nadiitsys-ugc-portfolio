import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-gray-100">
        <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
          <Link href="/" className="font-semibold text-gray-900 tracking-tight">
            nadiitsys
          </Link>
          <Link href="/beauty" className="text-sm text-gray-600 hover:text-gray-900">
            Beauty
          </Link>
          <Link href="/travel" className="text-sm text-gray-600 hover:text-gray-900">
            Travel
          </Link>
        </nav>
      </header>
      {children}
      <footer className="mt-auto border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center text-xs text-gray-400">
          © {new Date().getFullYear()} Nadii Tsys
        </div>
      </footer>
    </>
  );
}

import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-xl text-center">
                <h1 className="text-6xl font-bold text-[#00468e] mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
                <p className="text-gray-600 mb-8">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 rounded-lg bg-[#00468e] text-white font-semibold hover:bg-[#003366] transition"
                >
                    Go back to Home
                </Link>
            </div>
        </main>
    );
}

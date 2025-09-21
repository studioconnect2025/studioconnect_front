import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-sky-800 w-full py-10 flex flex-col items-center justify-center">
        <h1 className="text-white text-2xl font-semibold mb-6">Ups, esta página no existe</h1>
        <img
          src="/logo.png"
          alt="StudioConnect Logo"
          className="h-28 md:h-36"
        />
      </div>

      <main className="flex-1 flex items-center justify-center bg-white">
        <div className="rounded-xl border border-slate-200 shadow-sm p-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-sky-700 hover:bg-sky-800 text-white text-sm shadow-sm"
          >
            Ir al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}

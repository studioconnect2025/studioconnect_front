"use client";

import Link from "next/link";
import { Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#00618E] to-[#25665800] text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">StudioConnect</h3>
          <p className="text-sm">
            Conectando músicos con estudios perfectos en todo el país.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Para músicos</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Encuentra estudios</Link></li>
            <li><Link href="#" className="hover:text-white">Reservas</Link></li>
            <li><Link href="#" className="hover:text-white">Reviews</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Para propietarios de estudios</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Sumar mi estudio</Link></li>
            <li><Link href="#" className="hover:text-white">Gestionar reservas</Link></li>
            <li><Link href="#" className="hover:text-white">Análisis y métricas</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Soporte</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Centro de ayuda</Link></li>
            <li><Link href="#" className="hover:text-white">Contáctanos</Link></li>
            <li><Link href="#" className="hover:text-white">Términos de servicio</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700" />
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <p>© {year} StudioConnect. Todos los derechos reservados.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white"><Twitter className="h-5 w-5" /></Link>
          <Link href="#" className="hover:text-white"><Instagram className="h-5 w-5" /></Link>
          <Link href="#" className="hover:text-white"><Linkedin className="h-5 w-5" /></Link>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { FaGithub } from "react-icons/fa";

const colaboradores = [
  { nombre: "Ezequiel Petruzzi", github: "https://github.com/epetruzzi" },
  { nombre: "Daiana L.", github: "https://github.com/Daiana-L" },
  { nombre: "Mariano Ricoy", github: "https://github.com/MarianoRicoy" },
  { nombre: "Vicky Gallo", github: "https://github.com/VickyGallo" },
  { nombre: "Shxntiyi", github: "https://github.com/Shxntiyi" },
  { nombre: "Rafael Álvarez", github: "https://github.com/RafaelAlvarezSM" },
  { nombre: "Jesús VG", github: "https://github.com/JesusVG1" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#00618E] to-[#25665800] text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
        {/* Logo de la página */}
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.png" alt="Logo de StudioConnect" className="h-14" />
        </div>

        {/* Colaboradores */}
        <div className="mb-8">
          <span className="text-white text-xl font-semibold">Colaboradores</span>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            {colaboradores.map((colaborador, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <a
                  href={colaborador.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-gray-300"
                >
                  <FaGithub className="h-8 w-8" />
                  <span>{colaborador.nombre}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8" />
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-400">
          <p>© {year} StudioConnect. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

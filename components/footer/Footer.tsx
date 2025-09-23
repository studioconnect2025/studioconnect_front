"use client";

import { FaGithub } from "react-icons/fa";

const colaboradores = [
  { nombre: "Ezequiel Petruzzi", github: "https://github.com/epetruzzi" },
  { nombre: "Daiana Lopez", github: "https://github.com/Daiana-L" },
  { nombre: "Mariano Ricoy", github: "https://github.com/MarianoRicoy" },
  { nombre: "Vicky Gallo", github: "https://github.com/VickyGallo" },
  { nombre: "Angel Tarazona", github: "https://github.com/Shxntiyi" },
  { nombre: "Rafael Álvarez", github: "https://github.com/RafaelAlvarezSM" },
  { nombre: "Jesús Valadez", github: "https://github.com/JesusVG1" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#00618E] to-[#25665800] text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <img src="/logo.png" alt="Logo de StudioConnect" className="h-10 sm:h-14" />
        </div>

        {/* Colaboradores */}
        <div className="mb-6 sm:mb-8 w-full">
          <span className="text-white text-lg sm:text-xl font-semibold text-center block">
            Colaboradores
          </span>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4">
            {colaboradores.map((colaborador, index) => (
              <a
                key={index}
                href={colaborador.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 sm:gap-2 w-auto min-w-[100px] text-white hover:text-gray-300 text-[10px] sm:text-sm"
              >
                <FaGithub className="h-5 w-5 sm:h-8 sm:w-8" />
                <span className="whitespace-nowrap text-center">{colaborador.nombre}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 w-full mt-4 sm:mt-8" />

        {/* Copyright */}
        <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4 text-center text-[10px] sm:text-sm text-gray-400">
          <p>© {year} StudioConnect. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

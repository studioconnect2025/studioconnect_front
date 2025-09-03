"use client"
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header>
      <nav className="bg-black border-gray-200 px-4 lg:px-6 py-6 dark:bg-black">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-56 h-auto" />
          </a>

          {/* Links vista normal */}
          <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="desktop-menu">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                  aria-current="page"
                >
                  Únete como músico
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Únete como anfitrión
                </a>
              </li>
            </ul>
          </div>

          {/* Botones login/signup */}
          <div className="hidden lg:flex items-center lg:order-2">
            <a href="/login" className="text-white p-2 mr-5">Iniciar sesión</a>
            <a href="#" className="text-white bg-[#015C85] rounded-lg p-2">Registrarse</a>
          </div>

          {/* Vista móvil */}
          <div className="flex lg:hidden items-center">
            <button
              className="text-white p-2 focus:outline-none"
              onClick={toggleMenu}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar móvil */}
      <div
        className={`fixed top-0 left-0 h-full w-full z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      >
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full w-64 bg-black text-white transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cerrar */}
          <div className="flex justify-end p-4">
            <button onClick={closeMenu}>
              <X size={24} />
            </button>
          </div>

          {/* Links vista móvil */}
          <ul className="flex flex-col mt-6 space-y-4 p-4">
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:bg-gray-800"
              >
                Únete como anfitrión
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:bg-gray-800"
              >
                Únete como músico
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="block py-2 px-3 text-white rounded hover:bg-gray-800"
              >
                Iniciar sesión
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 rounded bg-[#015C85] text-white"
              >
                Registrarse
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { FaBuilding, FaUser } from "react-icons/fa";
import { MdAppRegistration, MdOutlineDashboardCustomize } from "react-icons/md";
import { TbLogin } from "react-icons/tb";
import { CgStudio } from "react-icons/cg";
import { useIsAuth, useAuthUser, useAuthStore } from "@/stores/AuthStore";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal/modal"; 
import LoginPage from "@/components/login/login";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const router = useRouter();

  // estados de auth
  const isLoggedIn = useIsAuth();
  const user = useAuthUser();
  const logout = useAuthStore((s) => s.logout);

  return (
    <header>
      <nav className="bg-black border-gray-200 px-4 lg:px-6 py-6 dark:bg-black">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-56 h-auto" />
          </Link>

          {/* Links desktop */}
          {!isLoggedIn && (
            <div className="hidden lg:flex lg:w-auto lg:order-1">
              <ul className="flex flex-row lg:space-x-8 font-medium">
                <li>
                  <Link
                    href="#"
                    className="block py-2 px-3 cursor-pointer text-white hover:text-gray-400"
                  >
                    Únete como músico
                  </Link>
                </li>
                <li>
                  <Link
                    href="/useOwnerForm"
                    className="block py-2 px-3 cursor-pointer text-white hover:text-gray-400"
                  >
                    Únete como anfitrión
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Botones desktop */}
          <div className="hidden lg:flex items-center lg:order-2 gap-6 mr-16">
            {isLoggedIn ? (
              <>
                <span className="text-white">Hola {user?.name}</span>
                <button
                  className="text-white hover:bg-sky-800 cursor-pointer p-2 rounded-lg"
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                >
                  Cerrar sesión
                </button>
                <button
                  className="text-white cursor-pointer hover:bg-sky-800 p-2 rounded-lg"
                  onClick={toggleMenu}
                >
                  Menú
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="text-white hover:bg-sky-800 cursor-pointer p-2 mr-5 rounded-lg"
                >
                  Iniciar sesión
                </button>
                <Link
                  href="/joinStudioConnect"
                  className="text-white hover:bg-sky-800 rounded-lg p-2"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón móvil */}
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

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full z-50 transition-opacity duration-300 
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeMenu}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 lg:hidden"></div>

        <div
          className={`absolute top-0 left-0 lg:right-0 lg:left-auto h-full bg-black text-white transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-full"}
            w-full sm:w-64 lg:w-[400px]`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end p-4">
            <button onClick={closeMenu}>
              <X size={24} />
            </button>
          </div>
          <ul className="flex flex-col mt-6 space-y-4 p-6">
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    href="/profileOwner"
                    className="w-full py-2 px-3 flex rounded hover:bg-gray-800"
                  >
                    <FaUser size={24} className="mr-3" /> Mi perfil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studioRegister"
                    className="w-full py-2 px-3 flex rounded hover:bg-gray-800"
                  >
                    <MdAppRegistration size={24} className="mr-3" /> Registrar mi estudio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studioDashboard"
                    className="flex w-full py-2 px-3 rounded hover:bg-gray-800"
                  >
                    <MdOutlineDashboardCustomize size={24} className="mr-3" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/myStudio"
                    className="flex w-full py-2 px-3 rounded hover:bg-gray-800"
                  >
                    <FaBuilding size={24} className="mr-3" />
                    Mi estudio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studioRooms"
                    className="flex w-full py-2 px-3 rounded hover:bg-gray-800"
                  >
                    <CgStudio size={24} className="mr-3" />
                    Mis salas
                  </Link>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      await logout();
                      router.push("/");
                    }}
                    className="w-full flex text-left cursor-pointer py-2 px-3 rounded hover:bg-gray-800"
                  >
                    <TbLogin size={24} className="mr-3" />
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="#"
                    className="block py-2 px-3 text-white rounded hover:bg-gray-800"
                    onClick={(e) => {
                      e.preventDefault();
                      openLoginModal();
                    }}
                  >
                    Únete como músico
                  </Link>
                </li>
                <li>
                  <Link
                    href="/useOwnerForm"
                    className="block py-2 px-3 text-white rounded hover:bg-gray-800"
                  >
                    Únete como anfitrión
                  </Link>
                </li>
                <li>
                  <button
                    className="block py-2 px-3 text-white rounded hover:bg-gray-800 w-full text-left"
                    onClick={openLoginModal}
                  >
                    Iniciar sesión
                  </button>
                </li>
                <li>
                  <Link
                    href="/joinStudioConnect"
                    className="block py-2 px-3 rounded bg-[#015C85] text-white"
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Modal de login */}
      <Modal isOpen={loginModalOpen} onClose={closeLoginModal}>
        <LoginPage onClose={closeLoginModal} />
      </Modal>
    </header>
  );
};

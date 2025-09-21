"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { FaBuilding, FaCalendarCheck, FaUser } from "react-icons/fa";
import { MdAppRegistration, MdOutlineCardMembership, MdOutlineDashboardCustomize, MdOutlineWavingHand } from "react-icons/md";
import { TbLogin } from "react-icons/tb";
import { CgStudio } from "react-icons/cg";
import { CiLogin } from "react-icons/ci";
import { IoMdMenu } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import { MdReviews, MdSettings } from "react-icons/md";

import { useIsAuth, useAuthUser, useAuthStore } from "@/stores/AuthStore";
import { Modal } from "@/components/modal/modal";
import LoginPage from "@/components/login/login";
import { profileService } from "@/services/musician.services";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const router = useRouter();
  const isLoggedIn = useIsAuth();
  const user = useAuthUser();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (!token || !isLoggedIn) return;

        const data = await profileService.getMyProfile();
        if (!mounted) return;

        if (data?.profile) {
          const fullName = `${data.profile.nombre ?? ""} ${data.profile.apellido ?? ""}`.trim();
          setProfileName(fullName);
        } else {
          setProfileName("");
        }
      } catch (error: any) {
        console.error("Error cargando perfil en Header:", error);
      }
    };

    if (isLoggedIn) fetchProfile();

    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  return (
    <header>
      <nav className="bg-black border-gray-200 px-4 lg:px-6 py-6 dark:bg-black">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-2xl">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-56 h-auto" />
          </Link>

          {!isLoggedIn && (
            <div className="hidden ml-16 lg:flex lg:w-auto lg:order-1">
              <ul className="flex flex-row lg:space-x-8 font-medium">
                <li>
                  <Link href="/useMusicianForm" className="block py-2 px-3 cursor-pointer text-white hover:text-gray-400">
                    Únete como músico
                  </Link>
                </li>
                <li>
                  <Link href="/useOwnerForm" className="block py-2 px-3 cursor-pointer text-white hover:text-gray-400">
                    Únete como anfitrión
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div className="hidden lg:flex items-center lg:order-2 gap-6 mr-16">
            {isLoggedIn ? (
              <>
                <span className="text-white flex">
                  <MdOutlineWavingHand size={30} className="mr-3" />
                  Hola {profileName || user?.name}!
                </span>

                {user?.role === "Dueño de Estudio" && (
                  <Link href="/memberships" className="flex py-2 px-3 cursor-pointer text-white hover:bg-sky-800 p-2 rounded-lg">
                    <MdOutlineCardMembership size={30} className="mr-2" /> Planes
                  </Link>
                )}

                <button
                  className="text-white flex hover:bg-sky-800 cursor-pointer p-2 rounded-lg"
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                >
                  <TbLogin size={30} className="mr-2" /> Cerrar sesión
                </button>

                <button className="text-white flex cursor-pointer hover:bg-sky-800 p-2 rounded-lg" onClick={toggleMenu}>
                  <IoMdMenu size={30} className="mr-2" /> Menú
                </button>
              </>
            ) : (
              <>
                <button onClick={openLoginModal} className="text-white hover:bg-sky-800 cursor-pointer flex p-2 mr-5 rounded-lg">
                  <CiLogin size={30} className="mr-2" /> Iniciar sesión
                </button>

              </>
            )}
          </div>

          <div className="flex lg:hidden items-center">
            <button className="text-white p-2 focus:outline-none" onClick={toggleMenu}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 h-full w-full z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeMenu}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 lg:hidden"></div>

        <div
          className={`absolute top-0 left-0 lg:right-0 lg:left-auto h-full bg-black text-white transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-full"
          } w-full sm:w-64 lg:w-[400px]`}
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

                {/* Mi perfil (solo si NO es admin) */}
{user?.role !== "Administrador" && (
  <li>
    <Link href="/musicianProfile" className="w-full py-2 px-3 flex rounded hover:bg-gray-800">
      <FaUser size={24} className="mr-3" /> Mi perfil
    </Link>
  </li>
)}

                {user?.role === "Dueño de Estudio" && (
                  <>
                    <li>
                      <Link href="/memberships" className="flex w-full py-2 px-3 rounded hover:bg-gray-800">
                        <MdOutlineCardMembership size={24} className="mr-3" /> Planes
                      </Link>
                    </li>
                    <li>
                      <Link href="/studioRegister" className="w-full py-2 px-3 flex rounded hover:bg-gray-800">
                        <MdAppRegistration size={24} className="mr-3" /> Registrar mi estudio
                      </Link>
                    </li>
                    <li>
                      <Link href="/studioDashboard" className="flex w-full py-2 px-3 rounded hover:bg-gray-800">
                        <MdOutlineDashboardCustomize size={24} className="mr-3" /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/myStudio" className="flex w-full py-2 px-3 rounded hover:bg-gray-800">
                        <FaBuilding size={24} className="mr-3" /> Mi estudio
                      </Link>
                    </li>
                    <li>
                      <Link href="/studioRooms" className="flex w-full py-2 px-3 rounded hover:bg-gray-800">
                        <CgStudio size={24} className="mr-3" /> Mis salas
                      </Link>
                    </li>
                  </>
                )}

           {user?.role === "Administrador" && (
  <>
    <li>
      <Link
        href="/admin"
        className="flex py-2 px-3 cursor-pointer text-white hover:bg-sky-800 p-2 rounded-lg"
      >
        <MdOutlineDashboardCustomize size={30} className="mr-2" />
        Dashboard
      </Link>
    </li>
    <li>
      <Link
        href="/admin/users"
        className="flex py-2 px-3 cursor-pointer text-white hover:bg-sky-800 p-2 rounded-lg"
      >
        <FaUserCog size={30} className="mr-2" />
        Usuarios
      </Link>
    </li>
    <li>
      <Link
        href="/admin/studios"
        className="flex py-2 px-3 cursor-pointer text-white hover:bg-sky-800 p-2 rounded-lg"
      >
        <FaBuilding size={30} className="mr-2" />
        Estudios
      </Link>
    </li>
    <li>
      <Link
        href="/admin/reviews"
        className="flex py-2 px-3 cursor-pointer text-white hover:bg-sky-800 p-2 rounded-lg"
      >
        <MdReviews size={30} className="mr-2" />
        Reviews
      </Link>
    </li>
    
  </>
)}


                <li>
                  <button
                    onClick={async () => {
                      await logout();
                      router.push("/");
                    }}
                    className="w-full flex text-left cursor-pointer py-2 px-3 rounded hover:bg-gray-800"
                  >
                    <TbLogin size={24} className="mr-3" /> Cerrar sesión
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
                  <Link href="/useOwnerForm" className="block py-2 px-3 text-white rounded hover:bg-gray-800">
                    Únete como anfitrión
                  </Link>
                </li>
                <li>
                  <button className="block py-2 px-3 text-white rounded hover:bg-gray-800 w-full text-left" onClick={openLoginModal}>
                    Iniciar sesión
                  </button>
                </li>
                <li>
                  <Link href="/joinStudioConnect" className="block py-2 px-3 rounded bg-[#015C85] text-white">
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <Modal isOpen={loginModalOpen} onClose={closeLoginModal}>
        <LoginPage onClose={closeLoginModal} />
      </Modal>
    </header>
  );
};

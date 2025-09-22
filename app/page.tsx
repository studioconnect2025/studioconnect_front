"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { BannerImg } from "@/components/banners/BannerImg";
import { BannerSearch } from "@/components/banners/BannerSearch";
import { BannerText } from "@/components/banners/BannerText";
import ClientUserLocationMap from "@/components/LocationMap/ClientUserLocationMap";
import { FeaturedStudiosList } from "@/components/studio/FeatureStudioList";
import WhyChooseStudioConnect from "@/components/WhyChooseStudioConnect/WhyChooseStudioConnect";
import { OwnerToolbar } from "@/components/ownerToolBar/ownerToolBar";
import { useAuthUser, useAuthStore, useIsAuth } from "@/stores/AuthStore";
import ReviewList from "@/components/reviews/ReviewList";
import { http } from "@/lib/http";

export default function Home() {
  const isLoggedIn = useIsAuth();
  const user = useAuthUser();
  const token = useAuthStore((s) => s.accessToken);

  const [userCenter, setUserCenter] = useState<[number, number]>([-34.6037, -58.3816]);
  const [hasStudio, setHasStudio] = useState<boolean | null>(null);
  const [studioStatus, setStudioStatus] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    if (user?.role === "Dueño de Estudio" && token) {
      http
        .get("/users/me")
        .then((res) => {
          const estudio = res.data.studio;
          if (estudio) {
            setHasStudio(true);
            setStudioStatus(estudio.status);
          } else {
            setHasStudio(false);
          }
        })
        .catch((err) => {
          console.error("Error al obtener usuario:", err);
          setHasStudio(false);
        });
    }
  }, [user, token]);

  return (
    <div className="bg-white">
      {/* Banner principal */}
      <div className="flex flex-col md:flex-row justify-center items-center pt-10 pb-10 px-4 sm:px-6 bg-gradient-to-b from-sky-800 to-black overflow-hidden">
        <div className="flex flex-col md:flex-row w-full max-w-6xl justify-between items-center gap-8">
          <div
            className="w-full md:w-1/2 flex items-center justify-center"
            data-aos="fade-right"
            data-aos-delay={100}
          >
            <BannerText />
          </div>
          <div
            className="w-full md:w-1/2 flex justify-center"
            data-aos="fade-left"
            data-aos-delay={200}
          >
            <BannerImg />
          </div>
        </div>
      </div>

      {/* Sección principal */}
      <div
        className="bg-white flex flex-col items-center p-4 sm:p-6 relative z-20"
        data-aos="fade-right"
        data-aos-delay={300}
      >
        <div className="w-full max-w-6xl">
      {user?.role === "Dueño de Estudio" ? (
  hasStudio === null ? (
    <p>Cargando información de tu estudio...</p>
  ) : hasStudio ? (
    studioStatus === "aprovado" ? (
      <OwnerToolbar />
    ) : (
      <div className="flex flex-col items-center justify-center p-8 border rounded-xl bg-yellow-50 text-center">
        <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
          Tu estudio está pendiente de aprobación
        </h2>
        <p className="text-yellow-700">
          Pronto recibirás una notificación sobre si tu estudio cumple
          con los requisitos para usar StudioConnect.
        </p>
      </div>
    )
  ) : (
    <div className="flex flex-col items-center justify-center p-8 border rounded-xl bg-gray-50 text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        No has registrado tu estudio todavía
      </h2>
      <p className="text-gray-700 mb-4">
        Para comenzar a usar StudioConnect necesitas registrar tu estudio.
      </p>
      <a
        href="/studioRegister"
        className="px-6 py-2 bg-sky-700 text-white font-medium rounded-lg shadow hover:bg-sky-800 transition"
      >
        Ir a registrar estudio
      </a>
    </div>
  )
) : (
  <div className="flex flex-col mt-8 ">
    <h2 className="text-black text-2xl sm:text-3xl md:text-3xl text-center mb-3">
      Encuentra tu estudio ideal
    </h2>
    <p className="text-black text-sm sm:text-base md:text-lg text-center sm:mt-4">
      Estudios en la ubicación de tu preferencia
    </p>
    <BannerSearch onLocationSelect={(lat, lng) => setUserCenter([lat, lng])} />
  </div>
)}

        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white flex flex-col items-center p-4 sm:p-6">
        <div className="w-full max-w-6xl rounded-xl shadow-lg relative z-0">
          <ClientUserLocationMap center={userCenter} />
        </div>
      </div>

      {/* Estudios destacados */}
      <div
        className="bg-white flex flex-col items-center p-4 sm:p-6 -mt-6"
        data-aos="fade-right"
        data-aos-delay={600}
      >
        <div className="w-full max-w-6xl">
          <FeaturedStudiosList limit={3} />
        </div>
      </div>

      {/* Por qué elegir StudioConnect */}
      <div className="bg-white" data-aos="fade-right" data-aos-delay={700}>
        <WhyChooseStudioConnect />
      </div>

      {/* Reseñas */}
      <div
        className="bg-white flex flex-col items-center p-4 sm:p-6 -mt-6"
        data-aos="fade-right"
        data-aos-delay={800}
      >
        <div className="w-full max-w-6xl">
          <ReviewList />
        </div>
      </div>
    </div>
  );
}

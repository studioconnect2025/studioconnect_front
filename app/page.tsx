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
import { useAuthUser, useIsAuth } from "@/stores/AuthStore";
import ReviewList from "@/components/reviews/ReviewList";

export default function Home() {
  const isLoggedIn = useIsAuth();
  const user = useAuthUser();
  const [userCenter, setUserCenter] = useState<[number, number]>([-34.6037, -58.3816]);

  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="bg-white"> {/* Fondo blanco global */}
      {/* Banner principal con degradé estático */}
      <div
        className="flex flex-col md:flex-row justify-center items-center pt-10 pb-10 px-4 sm:px-6 bg-gradient-to-b from-sky-800 to-black overflow-hidden"
      >
        <div className="flex flex-col md:flex-row w-full max-w-6xl justify-between items-center gap-8">
          {/* Texto con animación desde la derecha */}
          <div
            className="w-full md:w-1/2 flex items-center justify-center"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <BannerText />
          </div>

          {/* Imagen con animación desde la izquierda */}
          <div
            className="w-full md:w-1/2 flex justify-center"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <BannerImg />
          </div>
        </div>
      </div>

      {/* Sección OwnerToolbar o BannerSearch */}
      <div
        className="bg-white flex flex-col items-center p-4 sm:p-6"
        data-aos="fade-right"
        data-aos-delay="300"
      >
        <div className="w-full max-w-6xl">
          {user?.role === "Dueño de Estudio" ? (
            <OwnerToolbar />
          ) : (
            <div className="flex flex-col mt-8" data-aos="fade-right" data-aos-delay="400">
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

      {/* Mapa de ubicación */}
      <div
        className="bg-white flex flex-col items-center p-4 sm:p-6 -mt-6"
        data-aos="fade-right"
        data-aos-delay="500"
      >
        <div className="w-full max-w-6xl rounded-xl shadow-lg">
          <ClientUserLocationMap center={userCenter} />
        </div>
      </div>

      {/* Estudios destacados */}
      <div
        className="bg-white flex flex-col items-center p-4 sm:p-6 -mt-6"
        data-aos="fade-right"
        data-aos-delay="600"
      >
        <div className="w-full max-w-6xl">
          <FeaturedStudiosList limit={3} />
        </div>
      </div>

      {/* Por qué elegir StudioConnect */}
      <div className="bg-white" data-aos="fade-right" data-aos-delay="700">
        <WhyChooseStudioConnect />
      </div>

      {/* Reseñas */}
      <div
        className="bg-white flex flex-col items-center p-4 sm:p-6 -mt-6"
        data-aos="fade-right"
        data-aos-delay="800"
      >
        <div className="w-full max-w-6xl">
          <ReviewList />
        </div>
      </div>
    </div>
  );
}

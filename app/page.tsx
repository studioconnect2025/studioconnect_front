"use client";
import { BannerImg } from "@/components/banners/BannerImg";
import { BannerSearch } from "@/components/banners/BannerSearch";
import { BannerText } from "@/components/banners/BannerText";
import ClientUserLocationMap from "@/components/LocationMap/ClientUserLocationMap";
import { FeaturedStudiosList } from "@/components/studio/FeatureStudioList";
import WhyChooseStudioConnect from "@/components/WhyChooseStudioConnect/WhyChooseStudioConnect";
import { OwnerToolbar } from "@/components/ownerToolBar/ownerToolBar";
import { useAuthUser, useIsAuth } from "@/stores/AuthStore";
import { useState } from "react";
import ReviewList from "@/components/reviews/ReviewList";

export default function Home() {
    const isLoggedIn = useIsAuth();
    const user = useAuthUser();
    const [userCenter, setUserCenter] = useState<[number, number]>([
        -34.6037, -58.3816,
    ]);

    return (
        <div>
            {/* Banner principal */}
            <div
                className="flex flex-col md:flex-row justify-center items-center pt-10 pb-10 px-4 sm:px-6"
                style={{
                    background:
                        "linear-gradient(180deg, #00618E 0%, #25665800 100%)",
                }}
            >
                <div className="flex flex-col md:flex-row w-full max-w-6xl justify-between items-center gap-8">
                    {/* Texto */}
                    <div className="w-full md:w-1/2 flex items-center justify-center">
                        <BannerText />
                    </div>

                    {/* Imagen */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <BannerImg />
                    </div>
                </div>
            </div>

            {/* Si es dueño de estudio -> OwnerToolbar, si es musico -> BannerSearch */}
            <div className="bg-gray-100 flex flex-col items-center p-4 sm:p-6">
                <div className="w-full max-w-6xl">
                    {user?.role === "Dueño de Estudio" ? (
                        <OwnerToolbar />
                    ) : (
                        <div className="flex flex-col mt-8 ">
                            <h2 className="text-black text-2xl sm:text-3xl md:text-3xl text-center mb-3">
                                Encuentra tu estudio ideal
                            </h2>
                            <p className="text-black text-sm sm:text-base md:text-lg text-center sm:mt-4">
                               Estudios en la ubicación de tu preferencia
                            </p>
                            <BannerSearch
                                onLocationSelect={(lat, lng) =>
                                    setUserCenter([lat, lng])
                                }
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Mapa de ubicación del usuario */}
            <div className="bg-gray-100 flex flex-col items-center p-4 sm:p-6 -mt-6">
                <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg">
                    <ClientUserLocationMap center={userCenter} />
                </div>
            </div>

            {/* Sección Estudios destacados */}
            <div className="bg-gray-100 flex flex-col items-center p-4 sm:p-6 -mt-6">
                <div className="w-full max-w-6xl">
                    <FeaturedStudiosList limit={3} />
                </div>
            </div>

            {/* Sección por qué elegir StudioConnect */}
            <div>
                <WhyChooseStudioConnect />
            </div>

            {/* Sección de Reseñas */}
            <div className="bg-gray-100 flex flex-col items-center p-4 sm:p-6 -mt-6">
                <div className="w-full max-w-6xl">
                    <ReviewList />
                </div>
            </div>
        </div>
    );
}

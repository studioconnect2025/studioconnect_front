"use client";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useIsAuth } from "@/stores/AuthStore";

export const BannerText = () => {
    const isLoggedIn = useIsAuth();

    return (
        <div className="relative p-4 sm:p-6 md:p-8 lg:p-10">
            {/* Notas musicales PNG */}
            <img
                src="/nota1.png"
                alt="nota1"
                className="absolute -top-2 -left-2 w-20 sm:w-28 md:w-36 rotate-[-5deg]"
            />
            <img
                src="/nota2.png"
                alt="nota abajo derecha"
                className="absolute -top-4 right-2 sm:-top-6 sm:right-6 w-8 sm:w-10 md:w-12 rotate-[-30deg]"
            />

            {/* Texto principal */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white relative z-10">
                Conecta con los mejores estudios de música
            </h1>
            <p className="text-[#B9B9B9] mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg relative z-10">
                Encuentra y reserva estudios de grabación y salas de ensayo
                cerca de ti. Espacios profesionales para músicos, productores y
                artistas.
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 relative z-10">
                <Link href="/search">
                    <button className="flex justify-center items-center cursor-pointer gap-2 bg-white text-black p-3 rounded-md w-full sm:w-auto">
                        Explorar estudios <MoveRight className="w-5 h-5" />
                    </button>
                </Link>
            </div>
        </div>
    );
};

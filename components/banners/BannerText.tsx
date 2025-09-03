import { MoveRight } from "lucide-react";

export const BannerText = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
        Conecta con los mejores estudios de música
      </h1>
      <p className="text-[#B9B9B9] mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg">
        Encuentra y reserva estudios de grabación y salas de ensayo cerca de ti. 
        Espacios profesionales para músicos, productores y artistas.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button className="flex justify-center items-center gap-2 bg-white text-black p-3 rounded-md w-full sm:w-auto">
          Explorar estudios <MoveRight className="w-5 h-5"/>
        </button>
        <button className="flex justify-center items-center gap-2 text-white p-3 border-2 border-white rounded-md w-full sm:w-auto">
          Registrar mi estudio <MoveRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


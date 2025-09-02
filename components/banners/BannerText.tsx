import { MoveRight } from "lucide-react";

export const BannerText = () => {
    return (
        <div className="bg-white p-4">
            <h1 className="text-4xl font-semibold text-black">Conecta con los mejores estudios de música</h1>
            <p className="text-gray-600">Encuentra y reserva estudios de grabación y salas de ensayo cerca de ti. Espacios profesionales para músicos, productores y artistas</p>
        <div className="flex gap-4 mt-4">
            <button className="flex  gap-2 bg-black text-white p-3 rounded-md m-5">Explorar estudios <MoveRight className="w-5 h-5"/></button>
            <button className="flex  gap-2 text-black p-3 border-2 border-black rounded-md m-5">Registrar mi estudio <MoveRight className="w-5 h-5" /></button>
        </div>
        </div>
        
    );
};

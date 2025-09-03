import { BannerImg } from "@/components/banners/BannerImg";
import { BannerSearch } from "@/components/banners/BannerSearch";
import { BannerText } from "@/components/banners/BannerText";

export default function Home() {
  return (
    <div>
      {/* Banner principal */}
      <div
        className="flex flex-col md:flex-row justify-center items-center pt-10 pb-10 px-4 sm:px-6"
        style={{
          background: "linear-gradient(180deg, #00618E 0%, #25665800 100%)",
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

      {/* Banner de búsqueda */}
      <div className="flex justify-center bg-gray-100 px-4 sm:px-6">
        <BannerSearch />
      </div>

      <div className="h-10">Otra sección </div>
    </div>
  );
}

// app/page.tsx
import { BannerImg } from "@/components/banners/BannerImg";
import { BannerSearch } from "@/components/banners/BannerSearch";
import { BannerText } from "@/components/banners/BannerText";
import ClientUserLocationMap from "@/components/LocationMap/ClientUserLocationMap";
import { ReviewList } from "@/components/reviews/ReviewList";
import { FeaturedStudiosList } from "@/components/studio/FeatureStudioList";
import WhyChooseStudioConnect from "@/components/WhyChooseStudioConnect/WhyChooseStudioConnect";

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
      <div className="bg-gray-100 flex flex-col items-center p-4 sm:p-6">
        <div className="w-full max-w-6xl">
          <BannerSearch />
        </div>
      </div>

      {/* Mapa de ubicación del usuario */}
      <div className="bg-gray-100 flex flex-col items-center p-4 sm:p-6 -mt-6">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg">
          <ClientUserLocationMap />
        </div>
      </div>
      {/* Sección Estudios destacados */}
      <div className="bg-gray-100 flex flex-col items-center p-4 sm:p-6 -mt-6" >
        <div className="w-full max-w-6xl  ">
           <FeaturedStudiosList limit={3} />
        </div>
      </div>
      {/*Seccion porque elegir studioconnect */}
      <div>
        <WhyChooseStudioConnect />
      </div>
      {/* Sección de Reseñas */}
      <div className="bg-gray-100 flex flex-col items-center p-4 sm:p-6 -mt-6" >
        <div className="w-full max-w-6xl  ">
           <ReviewList />
        </div>
      </div>
    </div>
  );
}

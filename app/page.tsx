import { BannerImg } from "@/components/banners/BannerImg";
import { BannerSearch } from "@/components/banners/BannerSearch";
import { BannerText } from "@/components/banners/BannerText";

export default function Home() {
  return (
    <div>
    <div className="flex justify-center pt-10 pb-10 bg-white">
      <div className="flex w-4/5 max-w-6xl justify-between">
        <div className="w-1/2 flex items-center justify-center">
          <BannerText />
        </div>
        <div className="w-1/2 flex justify-center">
          <BannerImg />
        </div>
      </div>
    </div>
      <div className="flex justify-center bg-gray-100">
        <BannerSearch />
      </div>
      <div className="h-10">

      </div>
      </div>
  );
}

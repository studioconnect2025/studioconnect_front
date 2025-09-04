import Image from "next/image";

export const BannerImg = () => {
  return (
    <div className="flex justify-center items-center p-2 sm:p-4 md:p-6">
      <Image
        src="/estudio.webp" 
        alt="Banner"
        width={700} 
        height={475}
        priority 
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAL0lEQVR4nGOw09f4/2zj/4ebDBVVGGTFpXODI0sDA3QUFRgYOPnERBTFhRR4+YQBCKAJ+AIwckYAAAAASUVORK5CYII=" 
        className="w-full sm:w-4/5 md:w-full max-w-xl m-2 sm:m-4 rounded-xl object-cover"
      />
    </div>
  );
};



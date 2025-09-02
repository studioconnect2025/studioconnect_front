import { Search, MapPin } from 'lucide-react';
export const BannerSearch = () => {
    return (
        <div className="text-black p-6 w-full max-w-6xl mx-auto">
            <h2 className="text-4xl text-center font-medium">Encuentra tu estudio perfecto</h2>
            <h3 className="text-lg text-center mb-6">
                Explora una amplia variedad de estudios y encuentra el que se adapte a tus necesidades.
            </h3>

            <div className="bg-white flex justify-center items-center p-6 mt-10 mb-10 rounded-md shadow-md space-x-6">

                <div className="flex flex-col w-48">
                    <label htmlFor="location" className="mb-2 font-medium">Location</label>
                    <div className="relative">
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            id="location"
                            type="text"
                            placeholder="City address"
                            className="border rounded-md p-2 pl-10 w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-col w-48">
                    <label htmlFor="studio" className="mb-2 font-medium">Studio Type</label>
                    <select id="studio" className="border rounded-md p-2 w-full">
                        <option value="">All Types</option>
                        <option value="bsas">Type A</option>
                        <option value="cordoba">Type B</option>
                        <option value="rosario">Type C</option>
                    </select>
                </div>

                <div className="flex flex-col w-48">
                    <label htmlFor="date" className="mb-2 font-medium">Date</label>
                    <input
                        id="date"
                        type="date"
                        className="border rounded-md p-2 w-full"
                    />
                </div>
                <div className="flex flex-col w-48">
                    <div className="mb-2 h-6"></div>
                    <div className='relative'><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <button className="bg-black p-2 text-white rounded-md w-full">Search</button>
                    </div>
                </div>
            </div>
            <div></div>
        </div>
    );
};

import MyStudioClient from "@/components/myStudio/MyStudioClient";

export default function MyStudioPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">Mi Estudio</h1>
        <MyStudioClient />
      </div>
    </div>
  );
}

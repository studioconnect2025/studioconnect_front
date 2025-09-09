import MyStudioClient from "@/components/myStudio/MyStudioClient";

export default function MyStudioPage() {
  return (
    <div className="min-h-screen bg-[#EEF3F6] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#0F172A] mb-6">Mi Estudio</h1>
        <MyStudioClient />
      </div>
    </div>
  );
}

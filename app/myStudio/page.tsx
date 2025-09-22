import MyStudioClient from "@/components/myStudio/MyStudioClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MyStudioPage() {
const cookieStore = await cookies();
  const studioStatus = cookieStore.get("studioStatus")?.value;
  if (studioStatus !== "aprovado") {
    redirect("/"); 
  }
  return <MyStudioClient />;
}

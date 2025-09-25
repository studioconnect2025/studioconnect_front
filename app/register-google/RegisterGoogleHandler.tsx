"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import { http } from "@/lib/http";

export default function RegisterGoogleHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reg_token = searchParams.get("reg_token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (role: string) => {
    if (!reg_token) {
      setError("Token de registro no encontrado.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await http.post(
        "/auth/register/google",
        { role },
        {
          headers: {
            Authorization: `Bearer ${reg_token}`,
          },
        }
      );

      console.log("✅ Registro completado:", data);

      const { nombre, apellido, email } = data.user || {};

      if (role === "Músico") {
        router.push(
          `/register/musician?nombre=${encodeURIComponent(
            nombre || ""
          )}&apellido=${encodeURIComponent(apellido || "")}&email=${encodeURIComponent(
            email || ""
          )}`
        );
      } else if (role === "Dueño de Estudio") {
        router.push(
          `/register/studio-owner?firstName=${encodeURIComponent(
            nombre || ""
          )}&lastName=${encodeURIComponent(apellido || "")}&email=${encodeURIComponent(
            email || ""
          )}`
        );
      }
    } catch (err: any) {
      console.error("❌ Error en el registro:", err);
      setError(
        err.response?.data?.message || "Error inesperado en el registro."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Completa tu registro</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              disabled={loading}
              onClick={() => handleRegister("Músico")}
            >
              {loading ? "Registrando..." : "Soy Músico"}
            </Button>

            <Button
              variant="primary"
              disabled={loading}
              onClick={() => handleRegister("Dueño de Estudio")}
            >
              {loading ? "Registrando..." : "Soy Dueño de Estudio"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

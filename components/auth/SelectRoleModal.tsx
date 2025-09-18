"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/AuthStore";
import { http } from "@/lib/http";
import Button from "../ui/Button";


export default function SelectRoleModal() {
  const { user, accessToken, setAuth } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedRole || !accessToken) return;
    setIsSubmitting(true);
    try {
      await http.post(
        "/auth/assign-role",
        { role: selectedRole },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Actualizo el user en store
      setAuth({
        accessToken,
        user: {
          ...user!,
          role: selectedRole,
        },
      });

      window.location.href = "/"; // redirijo al home
    } catch (error) {
      console.error("Error asignando rol:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selecciona tu rol</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Necesitamos que elijas tu rol para continuar:
          </p>
          <div className="flex flex-col gap-2">
            <Button
              variant={selectedRole === "Dueño de Estudio" ? "primary" : "outline"}
              onClick={() => setSelectedRole("Dueño de Estudio")}
            >
              Soy propietario
            </Button>
            <Button
              variant={selectedRole === "Músico" ? "primary" : "outline"}
              onClick={() => setSelectedRole("Músico")}
            >
              Soy músico
            </Button>
          </div>
          <Button
            className="w-full mt-4"
            disabled={!selectedRole || isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? "Guardando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

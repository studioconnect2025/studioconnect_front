# Services - Pagos

Este directorio contiene la lógica de servicios para manejar pagos en el frontend.

## 📂 Archivos
- `payment.service.ts` → Servicio central con integración directa a endpoints `/payments/*`.
- `membership.service.ts` → Wrapper para manejar pagos de membresías (dueños de estudio).
- `booking.service.ts` → Wrapper para manejar pagos de reservas (músicos).

---

## 🚀 Ejemplos de uso

### 1. Pago de Membresía (Dueño de estudio)
```ts
import { MembershipService } from "@/services/membership.service";

// Iniciar pago
const { clientSecret, paymentIntentId } = await MembershipService.pay("ANNUAL");

// Confirmar en backend después de pagar con Stripe.js
const confirm = await MembershipService.confirm(paymentIntentId);
console.log("Estado del pago de membresía:", confirm.status);

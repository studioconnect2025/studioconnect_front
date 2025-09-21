// stores/admin/StudiosStore.ts
import { create } from "zustand";
import {
  AdminStudiosService,
  type TimeseriesPoint,
} from "@/services/admin/AdminStudios";

type Counts = { pendiente: number; aprovado: number; bloqueado?: number };

type StudiosState = {
  loading: boolean;
  ts: TimeseriesPoint[];
  counts: Counts;
  lastUpdated?: number;
  refreshAll: () => Promise<void>;
  refreshCounts: () => Promise<void>;
  refreshTimeseries: () => Promise<void>;
};

export const useStudiosStore = create<StudiosState>((set, get) => ({
  loading: false,
  ts: [],
  counts: { pendiente: 0, aprovado: 0, bloqueado: 0 },
  lastUpdated: 0,
  refreshAll: async () => {
    set({ loading: true });
    try {
      const [ts, counts] = await Promise.all([
        AdminStudiosService.timeseriesNew({ days: 30 }),
        AdminStudiosService.countByStatus(),
      ]);
      set({
        ts,
        counts: {
          pendiente: counts.pendiente ?? 0,
          aprovado: counts.aprovado ?? 0, // 👈 ojo: "aprovado" (con v) como en backend
          bloqueado: counts.bloqueado ?? 0,
        },
        loading: false,
        lastUpdated: Date.now(),
      });
    } catch {
      set({ loading: false });
    }
  },
  refreshCounts: async () => {
    const counts = await AdminStudiosService.countByStatus();
    set({
      counts: {
        pendiente: counts.pendiente ?? 0,
        aprovado: counts.aprovado ?? 0,
        bloqueado: counts.bloqueado ?? 0,
      },
      lastUpdated: Date.now(),
    });
  },
  refreshTimeseries: async () => {
    const ts = await AdminStudiosService.timeseriesNew({ days: 30 });
    set({ ts, lastUpdated: Date.now() });
  },
}));

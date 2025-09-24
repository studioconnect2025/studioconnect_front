"use client";

import { useEffect, useState } from "react";
import { http } from "@/lib/http";

interface Membership {
  status: string;
  startDate: string;
  endDate: string;
  plan: string;
}

export default function MembershipStatus() {
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    http
      .get<Membership>("/memberships/owner/my-active-membership")
      .then((res) => setMembership(res.data))
      .catch(() => setMembership(null));
  }, []);

  if (!membership) return <p>No tenés una membresía activa.</p>;

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">Tu membresía</h2>
      <p>
        <strong>Plan:</strong> {membership.plan}
      </p>
      <p>
        <strong>Estado:</strong> {membership.status}
      </p>
      <p>
        <strong>Inicio:</strong> {new Date(membership.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Fin:</strong> {new Date(membership.endDate).toLocaleDateString()}
      </p>
    </div>
  );
}

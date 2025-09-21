// components/admin/RevenueChart.tsx
"use client";

/**
 * Gráfico simple en SVG (sin librerías) para evitar dependencias.
 * Si querés luego lo paso a Recharts.
 */
export default function RevenueChart() {
  // Puntos de ejemplo (enero a diciembre)
  const values = [60, 85, 110, 140, 170, 195, 220, 250, 265, 280, 290, 305];

  const width = 900;
  const height = 280;
  const padding = 32;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const xStep = (width - padding * 2) / (values.length - 1);

  const toX = (i: number) => padding + i * xStep;
  const toY = (v: number) =>
    height - padding - ((v - min) / (max - min)) * (height - padding * 2);

  const path = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`)
    .join(" ");

  // Área de relleno
  const area = `${path} L ${toX(values.length - 1)} ${height - padding} L ${toX(
    0
  )} ${height - padding} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[260px] sm:h-[300px]"
        role="img"
        aria-label="Ingresos de la plataforma por mes"
      >
        {/* Ejes básicos */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#e5e7eb"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#e5e7eb"
        />

        {/* Área */}
        <path d={area} fill="#0f4c64" opacity="0.2" />

        {/* Línea principal */}
        <path d={path} fill="none" stroke="#0f4c64" strokeWidth={3} />

        {/* Proyección punteada (simple offset) */}
        <path
          d={path}
          transform="translate(0,4)"
          fill="none"
          stroke="#9ca3af"
          strokeWidth={2}
          strokeDasharray="4 6"
        />

        {/* Puntos */}
        {values.map((v, i) => (
          <circle
            key={i}
            cx={toX(i)}
            cy={toY(v)}
            r={3}
            fill="#111827"
            stroke="#0f4c64"
            strokeWidth={2}
          />
        ))}
      </svg>
    </div>
  );
}

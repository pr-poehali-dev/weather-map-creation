import { useState } from 'react';

export type HazardLevel = 0 | 1 | 2 | 3 | 4;

export interface City {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
}

export const CITIES: City[] = [
  { id: 'lis', name: 'Лиссабон', code: 'LIS', x: 40, y: 340 },
  { id: 'mad', name: 'Мадрид', code: 'MAD', x: 70, y: 330 },
  { id: 'par', name: 'Париж', code: 'PAR', x: 120, y: 275 },
  { id: 'lon', name: 'Лондон', code: 'LON', x: 105, y: 250 },
  { id: 'ber', name: 'Берлин', code: 'BER', x: 175, y: 258 },
  { id: 'rom', name: 'Рим', code: 'ROM', x: 185, y: 330 },
  { id: 'osl', name: 'Осло', code: 'OSL', x: 180, y: 190 },
  { id: 'war', name: 'Варшава', code: 'WAW', x: 220, y: 250 },
  { id: 'kyi', name: 'Киев', code: 'IEV', x: 268, y: 262 },
  { id: 'ist', name: 'Стамбул', code: 'IST', x: 268, y: 328 },
  { id: 'msk', name: 'Москва', code: 'MOW', x: 320, y: 220 },
  { id: 'spb', name: 'С.-Петербург', code: 'LED', x: 300, y: 190 },
  { id: 'teh', name: 'Тегеран', code: 'THR', x: 360, y: 350 },
  { id: 'dxb', name: 'Дубай', code: 'DXB', x: 380, y: 400 },
  { id: 'ekb', name: 'Екатеринбург', code: 'SVX', x: 405, y: 205 },
  { id: 'tas', name: 'Ташкент', code: 'TAS', x: 445, y: 315 },
  { id: 'del', name: 'Дели', code: 'DEL', x: 490, y: 385 },
  { id: 'omk', name: 'Омск', code: 'OMS', x: 470, y: 205 },
  { id: 'nsk', name: 'Новосибирск', code: 'OVB', x: 510, y: 210 },
  { id: 'kat', name: 'Катманду', code: 'KTM', x: 540, y: 390 },
  { id: 'irk', name: 'Иркутск', code: 'IKT', x: 585, y: 230 },
  { id: 'blr', name: 'Бангалор', code: 'BLR', x: 505, y: 460 },
  { id: 'dac', name: 'Дакка', code: 'DAC', x: 575, y: 415 },
  { id: 'bkk', name: 'Бангкок', code: 'BKK', x: 610, y: 460 },
  { id: 'pek', name: 'Пекин', code: 'PEK', x: 655, y: 300 },
  { id: 'sha', name: 'Шанхай', code: 'SHA', x: 700, y: 330 },
  { id: 'hkg', name: 'Гонконг', code: 'HKG', x: 665, y: 400 },
  { id: 'yks', name: 'Якутск', code: 'YKS', x: 680, y: 175 },
  { id: 'sel', name: 'Сеул', code: 'ICN', x: 720, y: 300 },
  { id: 'tyo', name: 'Токио', code: 'TYO', x: 765, y: 310 },
  { id: 'vvo', name: 'Владивосток', code: 'VVO', x: 730, y: 258 },
  { id: 'sin', name: 'Сингапур', code: 'SIN', x: 625, y: 510 },
];

export const HAZARD_META: Record<Exclude<HazardLevel, 0>, { label: string; color: string; desc: string }> = {
  1: { label: 'НИЗКИЙ', color: 'hsl(var(--hazard-1))', desc: 'Явления возможны, риск минимален' },
  2: { label: 'УМЕРЕННЫЙ', color: 'hsl(var(--hazard-2))', desc: 'Грозы, шквалистый ветер' },
  3: { label: 'ВЫСОКИЙ', color: 'hsl(var(--hazard-3))', desc: 'Сильные грозы, град, ливни' },
  4: { label: 'ЭКСТРЕМАЛЬНЫЙ', color: 'hsl(var(--hazard-4))', desc: 'Опасность для жизни, торнадо' },
};

interface Props {
  zones: Record<string, HazardLevel>;
  onCityClick: (id: string) => void;
  activeLevel: HazardLevel;
}

// Упрощённый контур Евразии
const EURASIA_PATH =
  'M55,360 L35,345 L45,320 L30,300 L60,285 L55,255 L90,240 L100,215 L150,175 L175,150 ' +
  'L215,165 L255,150 L300,160 L295,130 L330,120 L360,140 L410,130 L470,120 L540,110 ' +
  'L620,120 L690,140 L740,150 L760,175 L745,205 L775,215 L785,255 L760,290 L785,320 ' +
  'L760,345 L720,335 L730,375 L695,420 L660,415 L640,470 L640,520 L610,530 L615,485 ' +
  'L580,460 L595,420 L560,405 L545,430 L500,475 L490,435 L455,415 L470,385 L420,395 ' +
  'L390,415 L385,375 L355,375 L340,340 L295,345 L275,375 L250,350 L200,355 L165,345 ' +
  'L120,360 L90,375 Z';

const HAZARD_FILLS: Record<Exclude<HazardLevel, 0>, string> = {
  1: 'hsl(158 64% 45% / 0.35)',
  2: 'hsl(48 96% 53% / 0.35)',
  3: 'hsl(27 96% 52% / 0.4)',
  4: 'hsl(0 84% 55% / 0.42)',
};
const HAZARD_STROKE: Record<Exclude<HazardLevel, 0>, string> = {
  1: 'hsl(158 64% 55%)',
  2: 'hsl(48 96% 60%)',
  3: 'hsl(27 96% 60%)',
  4: 'hsl(0 84% 62%)',
};

export default function EurasiaMap({ zones, onCityClick, activeLevel }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <svg viewBox="0 0 820 560" className="h-full w-full select-none" style={{ cursor: activeLevel === 0 ? 'default' : 'crosshair' }}>
      <defs>
        <radialGradient id="vign" cx="50%" cy="45%" r="70%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="hsl(0 0% 0% / 0.6)" />
        </radialGradient>
        <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill="hsl(0 0% 100% / 0.06)" />
        </pattern>
      </defs>

      {/* координатная сетка */}
      {Array.from({ length: 17 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="560" stroke="hsl(0 0% 100% / 0.04)" strokeWidth="1" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="820" y2={i * 50} stroke="hsl(0 0% 100% / 0.04)" strokeWidth="1" />
      ))}

      {/* материк */}
      <path d={EURASIA_PATH} fill="hsl(0 0% 8%)" stroke="hsl(0 0% 100% / 0.85)" strokeWidth="1.4" strokeLinejoin="round" />
      <path d={EURASIA_PATH} fill="url(#dots)" />

      {/* зоны опасности вокруг городов */}
      {CITIES.map((c) => {
        const lvl = zones[c.id];
        if (!lvl) return null;
        return (
          <g key={`z${c.id}`} className="animate-scale-in" style={{ transformOrigin: `${c.x}px ${c.y}px` }}>
            <circle cx={c.x} cy={c.y} r={22 + lvl * 6} fill={HAZARD_FILLS[lvl]} stroke={HAZARD_STROKE[lvl]} strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={c.x} cy={c.y} r={22 + lvl * 6} fill="none" stroke={HAZARD_STROKE[lvl]} strokeWidth="1" opacity="0.6" className="animate-ping-slow" style={{ transformOrigin: `${c.x}px ${c.y}px` }} />
          </g>
        );
      })}

      {/* города */}
      {CITIES.map((c) => {
        const lvl = zones[c.id];
        const isHover = hover === c.id;
        return (
          <g
            key={c.id}
            onClick={() => onCityClick(c.id)}
            onMouseEnter={() => setHover(c.id)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={c.x} cy={c.y} r="9" fill="transparent" />
            <circle cx={c.x} cy={c.y} r={isHover ? 3.4 : 2.4} fill={lvl ? HAZARD_STROKE[lvl] : 'hsl(0 0% 90%)'} />
            {(isHover || lvl) && (
              <text x={c.x + 6} y={c.y - 5} fontSize="8.5" fontFamily="IBM Plex Mono" fill={lvl ? HAZARD_STROKE[lvl] : 'hsl(0 0% 75%)'} style={{ pointerEvents: 'none' }}>
                {isHover ? c.name : c.code}
              </text>
            )}
          </g>
        );
      })}

      <rect x="0" y="0" width="820" height="560" fill="url(#vign)" style={{ pointerEvents: 'none' }} />

      {/* компас / рамка */}
      <g style={{ pointerEvents: 'none' }} opacity="0.5">
        <text x="14" y="24" fontSize="9" fontFamily="IBM Plex Mono" fill="hsl(158 64% 55%)">
          <tspan>◉ РАДАР // ЕВРАЗИЯ</tspan>
        </text>
        <text x="14" y="548" fontSize="8" fontFamily="IBM Plex Mono" fill="hsl(0 0% 45%)">
          GRID 50KM · MERCATOR · REALTIME
        </text>
      </g>
    </svg>
  );
}
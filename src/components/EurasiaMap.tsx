import { useRef } from 'react';

export type HazardLevel = 0 | 1 | 2 | 3 | 4;

export interface City {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
}

export interface HazardZone {
  id: string;
  level: Exclude<HazardLevel, 0>;
  points: { x: number; y: number }[];
}

export const CITIES: City[] = [
  { id: 'lis', name: 'Лиссабон', code: 'LIS', x: 70, y: 560 },
  { id: 'mad', name: 'Мадрид', code: 'MAD', x: 120, y: 545 },
  { id: 'par', name: 'Париж', code: 'PAR', x: 205, y: 455 },
  { id: 'lon', name: 'Лондон', code: 'LON', x: 175, y: 410 },
  { id: 'ber', name: 'Берлин', code: 'BER', x: 295, y: 425 },
  { id: 'rom', name: 'Рим', code: 'ROM', x: 310, y: 545 },
  { id: 'osl', name: 'Осло', code: 'OSL', x: 300, y: 310 },
  { id: 'war', name: 'Варшава', code: 'WAW', x: 370, y: 410 },
  { id: 'kyi', name: 'Киев', code: 'IEV', x: 450, y: 430 },
  { id: 'ist', name: 'Стамбул', code: 'IST', x: 450, y: 540 },
  { id: 'msk', name: 'Москва', code: 'MOW', x: 540, y: 360 },
  { id: 'spb', name: 'С.-Петербург', code: 'LED', x: 500, y: 310 },
  { id: 'teh', name: 'Тегеран', code: 'THR', x: 605, y: 580 },
  { id: 'dxb', name: 'Дубай', code: 'DXB', x: 640, y: 665 },
  { id: 'ekb', name: 'Екатеринбург', code: 'SVX', x: 685, y: 335 },
  { id: 'tas', name: 'Ташкент', code: 'TAS', x: 750, y: 520 },
  { id: 'del', name: 'Дели', code: 'DEL', x: 825, y: 640 },
  { id: 'omk', name: 'Омск', code: 'OMS', x: 790, y: 340 },
  { id: 'nsk', name: 'Новосибирск', code: 'OVB', x: 860, y: 345 },
  { id: 'kat', name: 'Катманду', code: 'KTM', x: 910, y: 650 },
  { id: 'irk', name: 'Иркутск', code: 'IKT', x: 985, y: 380 },
  { id: 'blr', name: 'Бангалор', code: 'BLR', x: 850, y: 765 },
  { id: 'dac', name: 'Дакка', code: 'DAC', x: 965, y: 690 },
  { id: 'bkk', name: 'Бангкок', code: 'BKK', x: 1025, y: 765 },
  { id: 'pek', name: 'Пекин', code: 'PEK', x: 1100, y: 500 },
  { id: 'sha', name: 'Шанхай', code: 'SHA', x: 1175, y: 550 },
  { id: 'hkg', name: 'Гонконг', code: 'HKG', x: 1115, y: 665 },
  { id: 'yks', name: 'Якутск', code: 'YKS', x: 1140, y: 290 },
  { id: 'sel', name: 'Сеул', code: 'ICN', x: 1210, y: 500 },
  { id: 'tyo', name: 'Токио', code: 'TYO', x: 1285, y: 515 },
  { id: 'vvo', name: 'Владивосток', code: 'VVO', x: 1230, y: 430 },
  { id: 'sin', name: 'Сингапур', code: 'SIN', x: 1050, y: 850 },
];

export const HAZARD_META: Record<Exclude<HazardLevel, 0>, { label: string; color: string; desc: string }> = {
  1: { label: 'НИЗКИЙ', color: 'hsl(var(--hazard-1))', desc: 'Явления возможны, риск минимален' },
  2: { label: 'УМЕРЕННЫЙ', color: 'hsl(var(--hazard-2))', desc: 'Грозы, шквалистый ветер' },
  3: { label: 'ВЫСОКИЙ', color: 'hsl(var(--hazard-3))', desc: 'Сильные грозы, град, ливни' },
  4: { label: 'ЭКСТРЕМАЛЬНЫЙ', color: 'hsl(var(--hazard-4))', desc: 'Опасность для жизни, торнадо' },
};

// Детализированный контур Евразии (viewBox 1400 x 900)
const EURASIA_PATH =
  'M120,545 L80,570 L60,555 L95,525 L60,510 L100,485 L85,455 L130,445 L150,415 ' +
  'L200,380 L175,360 L215,345 L260,320 L300,290 L340,300 L360,270 L410,285 L390,320 ' +
  'L430,335 L470,315 L455,285 L500,270 L490,240 L540,225 L520,195 L575,185 L560,155 ' +
  'L620,150 L660,175 L700,160 L690,130 L745,125 L790,145 L850,135 L920,128 L1000,135 ' +
  'L1080,130 L1160,145 L1230,140 L1290,160 L1270,195 L1310,210 L1345,240 L1320,275 ' +
  'L1360,300 L1340,340 L1295,330 L1310,375 L1265,395 L1290,430 L1250,455 L1275,500 ' +
  'L1235,510 L1255,555 L1210,540 L1230,585 L1185,565 L1200,605 L1160,585 L1150,635 ' +
  'L1115,615 L1130,670 L1085,650 L1095,700 L1055,680 L1075,740 L1040,770 L1060,830 ' +
  'L1035,865 L1015,830 L1000,780 L965,760 L980,710 L945,695 L960,650 L920,665 L905,705 ' +
  'L870,690 L860,745 L835,790 L810,755 L830,700 L800,675 L820,635 L785,620 L800,585 ' +
  'L760,600 L775,555 L740,540 L715,570 L680,555 L695,600 L660,655 L640,700 L615,660 ' +
  'L635,610 L600,590 L620,555 L585,545 L600,510 L565,525 L555,480 L520,495 L535,455 ' +
  'L495,470 L510,430 L470,445 L455,490 L420,505 L440,545 L410,590 L385,555 L400,510 ' +
  'L365,525 L380,480 L345,470 L360,510 L325,555 L300,530 L315,490 L280,505 L295,470 ' +
  'L255,485 L270,530 L235,545 L250,585 L215,575 L230,540 L195,555 L165,545 L120,545 Z';

interface Props {
  zones: HazardZone[];
  draftPoints: { x: number; y: number }[];
  activeLevel: HazardLevel;
  onMapClick: (p: { x: number; y: number }) => void;
}

const stroke: Record<Exclude<HazardLevel, 0>, string> = {
  1: 'hsl(158 64% 55%)',
  2: 'hsl(48 96% 60%)',
  3: 'hsl(27 96% 60%)',
  4: 'hsl(0 84% 62%)',
};

function ptsToStr(pts: { x: number; y: number }[]) {
  return pts.map((p) => `${p.x},${p.y}`).join(' ');
}

export default function EurasiaMap({ zones, draftPoints, activeLevel, onMapClick }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drawing = activeLevel !== 0;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drawing || !svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const loc = pt.matrixTransform(ctm.inverse());
    onMapClick({ x: Math.round(loc.x), y: Math.round(loc.y) });
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1400 900"
      onClick={handleClick}
      className="h-full w-full select-none"
      style={{ cursor: drawing ? 'crosshair' : 'default', display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="vign" cx="50%" cy="45%" r="75%">
          <stop offset="65%" stopColor="transparent" />
          <stop offset="100%" stopColor="hsl(0 0% 0% / 0.55)" />
        </radialGradient>
        <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.7" fill="hsl(0 0% 100% / 0.06)" />
        </pattern>
      </defs>

      {/* координатная сетка */}
      {Array.from({ length: 29 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="900" stroke="hsl(0 0% 100% / 0.035)" strokeWidth="1" />
      ))}
      {Array.from({ length: 19 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="1400" y2={i * 50} stroke="hsl(0 0% 100% / 0.035)" strokeWidth="1" />
      ))}

      {/* материк */}
      <path d={EURASIA_PATH} fill="hsl(0 0% 8%)" stroke="hsl(0 0% 100% / 0.9)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={EURASIA_PATH} fill="url(#dots)" style={{ pointerEvents: 'none' }} />

      {/* завершённые зоны угрозы */}
      {zones.map((z) => (
        <g key={z.id} className="animate-scale-in" style={{ pointerEvents: 'none' }}>
          <polygon
            points={ptsToStr(z.points)}
            fill={stroke[z.level]}
            fillOpacity="0.22"
            stroke={stroke[z.level]}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeDasharray="6 4"
          />
          <polygon points={ptsToStr(z.points)} fill="none" stroke={stroke[z.level]} strokeWidth="1" strokeOpacity="0.4" className="animate-pulse" />
          {/* метка уровня в центроиде */}
          <text
            x={z.points.reduce((s, p) => s + p.x, 0) / z.points.length}
            y={z.points.reduce((s, p) => s + p.y, 0) / z.points.length}
            fontSize="15"
            fontFamily="Oswald, sans-serif"
            fontWeight="600"
            fill={stroke[z.level]}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            L{z.level}
          </text>
        </g>
      ))}

      {/* черновик рисуемой зоны */}
      {draftPoints.length > 0 && drawing && (
        <g style={{ pointerEvents: 'none' }}>
          {draftPoints.length > 1 && (
            <polyline points={ptsToStr(draftPoints)} fill={stroke[activeLevel as Exclude<HazardLevel, 0>]} fillOpacity="0.12" stroke={stroke[activeLevel as Exclude<HazardLevel, 0>]} strokeWidth="2" strokeLinejoin="round" />
          )}
          {draftPoints.length > 2 && (
            <line x1={draftPoints[draftPoints.length - 1].x} y1={draftPoints[draftPoints.length - 1].y} x2={draftPoints[0].x} y2={draftPoints[0].y} stroke={stroke[activeLevel as Exclude<HazardLevel, 0>]} strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.5" />
          )}
          {draftPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i === 0 ? 6 : 4} fill={i === 0 ? stroke[activeLevel as Exclude<HazardLevel, 0>] : 'hsl(0 0% 95%)'} stroke={stroke[activeLevel as Exclude<HazardLevel, 0>]} strokeWidth="1.5" />
          ))}
        </g>
      )}

      {/* города */}
      {CITIES.map((c) => (
        <g key={c.id} style={{ pointerEvents: 'none' }}>
          <circle cx={c.x} cy={c.y} r="2.6" fill="hsl(0 0% 88%)" />
          <text x={c.x + 7} y={c.y - 6} fontSize="11" fontFamily="IBM Plex Mono" fill="hsl(0 0% 60%)">
            {c.name}
          </text>
        </g>
      ))}

      <rect x="0" y="0" width="1400" height="900" fill="url(#vign)" style={{ pointerEvents: 'none' }} />

      <g style={{ pointerEvents: 'none' }} opacity="0.5">
        <text x="18" y="30" fontSize="13" fontFamily="IBM Plex Mono" fill="hsl(158 64% 55%)">◉ РАДАР // ЕВРАЗИЯ · S.S.M.P</text>
        <text x="18" y="882" fontSize="11" fontFamily="IBM Plex Mono" fill="hsl(0 0% 45%)">GRID 50KM · MERCATOR · REALTIME</text>
      </g>
    </svg>
  );
}

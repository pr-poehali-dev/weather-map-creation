import { useState, useMemo } from 'react';
import EurasiaMap, { HazardLevel, HAZARD_META, HazardZone } from '@/components/EurasiaMap';
import Icon from '@/components/ui/icon';

const LEVELS: HazardLevel[] = [1, 2, 3, 4];

const TABS = [
  { id: 'map', label: 'РАДАР', icon: 'Radar' },
  { id: 'method', label: 'МЕТОДОЛОГИЯ', icon: 'FlaskConical' },
  { id: 'team', label: 'КОМАНДА', icon: 'Users' },
  { id: 'stats', label: 'СТАТИСТИКА', icon: 'BarChart3' },
  { id: 'archive', label: 'АРХИВ', icon: 'Archive' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const ARCHIVE = [
  { date: '2026-06-28', city: 'Москва', lvl: 3 as HazardLevel, event: 'Суперячейка, град 4см', obs: 'STORM-01' },
  { date: '2026-06-15', city: 'Новосибирск', lvl: 4 as HazardLevel, event: 'Торнадо F2, шквал 34 м/с', obs: 'DELTA-09' },
  { date: '2026-05-30', city: 'Стамбул', lvl: 2 as HazardLevel, event: 'Ливневый паводок', obs: 'CIRRUS-04' },
  { date: '2026-05-11', city: 'Токио', lvl: 3 as HazardLevel, event: 'Тайфун, порывы 28 м/с', obs: 'NIMBUS-02' },
  { date: '2026-04-22', city: 'Дели', lvl: 1 as HazardLevel, event: 'Пыльная буря', obs: 'CIRRUS-04' },
];

const CRITERIA = [
  { lvl: 1 as HazardLevel, cape: '< 500 J/kg', wind: '10–15 м/с', prob: '10–20%' },
  { lvl: 2 as HazardLevel, cape: '500–1500', wind: '15–22 м/с', prob: '20–45%' },
  { lvl: 3 as HazardLevel, cape: '1500–3000', wind: '22–30 м/с', prob: '45–70%' },
  { lvl: 4 as HazardLevel, cape: '> 3000 J/kg', wind: '> 30 м/с', prob: '> 70%' },
];

const INITIAL_ZONES: HazardZone[] = [
  // --- ЗАПАДНАЯ ЕВРОПА ---
  // L1 — Пиренейский п-ов
  { id: 'z_ibe', level: 1, points: [
    {x:65,y:545},{x:120,y:510},{x:175,y:520},{x:210,y:490},{x:225,y:520},
    {x:190,y:558},{x:145,y:578},{x:95,y:572},{x:68,y:558}
  ]},
  // L2 — Франция / Бенилюкс
  { id: 'z_fra', level: 2, points: [
    {x:155,y:420},{x:230,y:400},{x:285,y:415},{x:300,y:450},{x:270,y:480},
    {x:225,y:490},{x:175,y:470},{x:148,y:445}
  ]},
  // L1 — Британские о-ва
  { id: 'z_uk', level: 1, points: [
    {x:115,y:370},{x:165,y:360},{x:195,y:395},{x:185,y:430},{x:150,y:445},
    {x:115,y:420},{x:100,y:395}
  ]},
  // L3 — Германия / Польша
  { id: 'z_dpl', level: 3, points: [
    {x:285,y:400},{x:380,y:390},{x:405,y:425},{x:395,y:460},{x:340,y:475},
    {x:285,y:460},{x:268,y:435}
  ]},
  // L2 — Альпы / Италия север
  { id: 'z_alp', level: 2, points: [
    {x:268,y:455},{x:345,y:448},{x:360,y:490},{x:330,y:530},{x:295,y:545},
    {x:255,y:520},{x:250,y:485}
  ]},
  // L1 — Скандинавия
  { id: 'z_sca', level: 1, points: [
    {x:240,y:280},{x:310,y:255},{x:370,y:270},{x:390,y:310},{x:360,y:355},
    {x:300,y:370},{x:250,y:345},{x:225,y:310}
  ]},

  // --- ВОСТОЧНАЯ ЕВРОПА / РОССИЯ ЗАПАД ---
  // L3 — Украина / Молдова
  { id: 'z_ukr', level: 3, points: [
    {x:390,y:430},{x:480,y:410},{x:510,y:445},{x:500,y:490},{x:450,y:510},
    {x:395,y:495},{x:375,y:460}
  ]},
  // L2 — Беларусь / Прибалтика
  { id: 'z_bel', level: 2, points: [
    {x:380,y:360},{x:450,y:345},{x:490,y:375},{x:480,y:415},{x:415,y:430},
    {x:375,y:405}
  ]},
  // L4 — Центр России (Москва — Урал)
  { id: 'z_rus_c', level: 4, points: [
    {x:480,y:295},{x:600,y:278},{x:700,y:295},{x:720,y:355},{x:700,y:410},
    {x:615,y:435},{x:520,y:430},{x:490,y:390},{x:470,y:340}
  ]},
  // L3 — Поволжье / Каспий
  { id: 'z_volg', level: 3, points: [
    {x:580,y:430},{x:660,y:420},{x:680,y:480},{x:660,y:540},{x:610,y:555},
    {x:565,y:520},{x:555,y:465}
  ]},
  // L2 — Турция / Балканы
  { id: 'z_tur', level: 2, points: [
    {x:375,y:530},{x:460,y:510},{x:510,y:530},{x:525,y:575},{x:490,y:610},
    {x:430,y:620},{x:380,y:590},{x:360,y:555}
  ]},

  // --- БЛИЖНИЙ ВОСТОК / КАВКАЗ ---
  // L1 — Аравийский п-ов
  { id: 'z_ara', level: 1, points: [
    {x:555,y:600},{x:640,y:570},{x:690,y:600},{x:700,y:670},{x:660,y:720},
    {x:595,y:730},{x:545,y:680},{x:540,y:625}
  ]},
  // L2 — Иран / Афганистан
  { id: 'z_ira', level: 2, points: [
    {x:620,y:545},{x:720,y:520},{x:785,y:535},{x:800,y:590},{x:780,y:640},
    {x:710,y:655},{x:640,y:630},{x:610,y:590}
  ]},

  // --- ЦЕНТРАЛЬНАЯ АЗИЯ ---
  // L3 — Казахстан степь
  { id: 'z_kaz', level: 3, points: [
    {x:680,y:340},{x:820,y:320},{x:870,y:370},{x:875,y:440},{x:800,y:470},
    {x:710,y:460},{x:660,y:415}
  ]},
  // L1 — Пакистан / Инд
  { id: 'z_pak', level: 1, points: [
    {x:750,y:590},{x:835,y:560},{x:880,y:590},{x:890,y:645},{x:855,y:680},
    {x:795,y:680},{x:750,y:645}
  ]},
  // L2 — Западная Сибирь
  { id: 'z_wsib', level: 2, points: [
    {x:720,y:245},{x:870,y:230},{x:950,y:260},{x:960,y:330},{x:895,y:360},
    {x:790,y:360},{x:700,y:335}
  ]},

  // --- ЮЖНАЯ / ЮГО-ВОСТОЧНАЯ АЗИЯ ---
  // L4 — Индия (муссон)
  { id: 'z_ind', level: 4, points: [
    {x:785,y:615},{x:890,y:590},{x:935,y:640},{x:945,y:710},{x:900,y:775},
    {x:840,y:800},{x:785,y:775},{x:755,y:710},{x:755,y:645}
  ]},
  // L3 — Бенгальский залив / Бангладеш
  { id: 'z_ben', level: 3, points: [
    {x:935,y:640},{x:1010,y:620},{x:1045,y:670},{x:1020,y:730},{x:960,y:745},
    {x:920,y:710}
  ]},
  // L2 — Индокитай / Таиланд
  { id: 'z_ind2', level: 2, points: [
    {x:990,y:720},{x:1060,y:695},{x:1090,y:740},{x:1075,y:800},{x:1040,y:840},
    {x:990,y:840},{x:960,y:800},{x:955,y:755}
  ]},

  // --- ВОСТОЧНАЯ АЗИЯ ---
  // L4 — Китай (восток, циклон)
  { id: 'z_chn', level: 4, points: [
    {x:960,y:420},{x:1090,y:400},{x:1165,y:440},{x:1185,y:510},{x:1155,y:570},
    {x:1075,y:595},{x:980,y:570},{x:945,y:510},{x:945,y:455}
  ]},
  // L3 — Корея / Манчжурия
  { id: 'z_kor', level: 3, points: [
    {x:1165,y:415},{x:1240,y:400},{x:1285,y:445},{x:1290,y:500},{x:1250,y:540},
    {x:1185,y:545},{x:1155,y:500},{x:1155,y:455}
  ]},
  // L3 — Япония
  { id: 'z_jpn', level: 3, points: [
    {x:1270,y:460},{x:1335,y:455},{x:1360,y:500},{x:1345,y:545},{x:1285,y:560},
    {x:1250,y:525},{x:1255,y:480}
  ]},
  // L2 — Восточная Сибирь / Якутия
  { id: 'z_ysib', level: 2, points: [
    {x:960,y:190},{x:1130,y:175},{x:1230,y:210},{x:1240,y:280},{x:1160,y:310},
    {x:1050,y:310},{x:965,y:270}
  ]},
  // L1 — Монголия
  { id: 'z_mng', level: 1, points: [
    {x:950,y:360},{x:1060,y:340},{x:1130,y:370},{x:1135,y:430},{x:1060,y:455},
    {x:955,y:445}
  ]},
];

export default function Index() {
  const [tab, setTab] = useState<TabId>('map');
  const [zones, setZones] = useState<HazardZone[]>(INITIAL_ZONES);
  const [draft, setDraft] = useState<{ x: number; y: number }[]>([]);
  const [level, setLevel] = useState<HazardLevel>(3);

  const startDrawing = (l: HazardLevel) => {
    setLevel(l);
    setDraft([]);
  };

  const handleMapClick = (p: { x: number; y: number }) => {
    if (level === 0) return;
    setDraft((prev) => [...prev, p]);
  };

  const finishZone = () => {
    if (draft.length < 3 || level === 0) return;
    setZones((prev) => [...prev, { id: `z${Date.now()}`, level: level as Exclude<HazardLevel, 0>, points: draft }]);
    setDraft([]);
    setLevel(0);
  };

  const undoPoint = () => setDraft((prev) => prev.slice(0, -1));
  const cancelDraft = () => { setDraft([]); setLevel(0); };
  const removeLastZone = () => setZones((prev) => prev.slice(0, -1));

  const stats = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    zones.forEach((z) => (counts[z.level] = (counts[z.level] || 0) + 1));
    return counts;
  }, [zones]);

  const total = zones.length;

  return (
    <div className="min-h-screen bg-background text-foreground scanline">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1900px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-sm border border-hazard-1/60">
              <div className="animate-radar absolute inset-0 origin-center" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, hsl(158 64% 45% / 0.5) 40deg, transparent 60deg)' }} />
              <Icon name="Radar" size={18} className="relative text-hazard-1" />
            </div>
            <div className="leading-none">
              <div className="font-display text-lg font-semibold tracking-widest">S.S.M.P team</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">EURASIA HAZARD RADAR</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-[11px] text-muted-foreground md:flex">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-hazard-1" />
            LIVE · {new Date().toISOString().slice(0, 10)}
            <span className="mx-1 text-border">|</span>
            SYS.NOM
          </div>
        </div>
        {/* TABS */}
        <nav className="mx-auto flex max-w-[1900px] gap-1 overflow-x-auto px-3 pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap border px-3 py-1.5 text-[11px] tracking-wider transition-colors ${
                tab === t.id
                  ? 'border-hazard-1/60 bg-hazard-1/10 text-hazard-1'
                  : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              <Icon name={t.icon} size={13} />
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {tab === 'map' ? (
        <main className="mx-auto max-w-[1900px] px-3 py-3">
          <section className="grid gap-3 xl:grid-cols-[1fr_300px]">
            {/* MAP — большая, на всю высоту экрана */}
            <div className="animate-fade-in relative overflow-hidden rounded-sm border border-border bg-[hsl(0_0%_5%)]">
              <div className="flex items-center justify-between border-b border-border px-3 py-2 text-[11px] text-muted-foreground">
                <span>КАРТА ЕВРАЗИИ · {total} АКТИВНЫХ ЗОН</span>
                <span className="text-hazard-1">◉ TRACKING</span>
              </div>
              <div className="relative h-[calc(100vh-190px)] min-h-[520px] w-full">
                <EurasiaMap zones={zones} draftPoints={draft} activeLevel={level} onMapClick={handleMapClick} />

                {/* Подсказка при рисовании */}
                {level !== 0 && (
                  <div className="animate-fade-in absolute left-3 top-3 rounded-sm border border-hazard-1/50 bg-background/90 px-3 py-2 text-[11px] backdrop-blur">
                    <div className="flex items-center gap-1.5 text-hazard-1"><Icon name="PenTool" size={12} /> РИСОВАНИЕ · L{level}</div>
                    <div className="mt-1 text-muted-foreground">Кликай по карте, чтобы ставить углы зоны. Точек: {draft.length}</div>
                  </div>
                )}

                {/* LEGEND — правый нижний угол */}
                <div className="absolute bottom-3 right-3 w-[200px] rounded-sm border border-border bg-background/90 p-3 backdrop-blur">
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] tracking-widest text-muted-foreground">
                    <Icon name="ListTree" size={12} /> ЛЕГЕНДА · HAZARD
                  </div>
                  {LEVELS.map((l) => (
                    <div key={l} className="flex items-center gap-2 py-0.5">
                      <span className="h-3 w-3 rounded-[1px] border" style={{ background: HAZARD_META[l].color, borderColor: HAZARD_META[l].color }} />
                      <span className="text-[10px] font-medium" style={{ color: HAZARD_META[l].color }}>
                        L{l} {HAZARD_META[l].label}
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 space-y-1 border-t border-border pt-2 text-[9px] leading-tight text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Icon name="Zap" size={10} /> Гроза / молнии</div>
                    <div className="flex items-center gap-1.5"><Icon name="Wind" size={10} /> Шквал / ветер</div>
                    <div className="flex items-center gap-1.5"><Icon name="CloudHail" size={10} /> Град</div>
                    <div className="flex items-center gap-1.5"><Icon name="Tornado" size={10} /> Смерч / торнадо</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROL PANEL */}
            <aside className="animate-fade-in space-y-3" style={{ animationDelay: '0.1s' }}>
              <div className="rounded-sm border border-border bg-card p-3">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] tracking-widest text-muted-foreground">
                  <Icon name="PenTool" size={13} /> НАРИСОВАТЬ ЗОНУ
                </div>
                <p className="mb-3 text-[10px] leading-relaxed text-muted-foreground">
                  Выбери уровень угрозы, затем кликами по карте обведи область — она заполнится цветом.
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => startDrawing(l)}
                      className={`flex flex-col items-start gap-0.5 border p-2 text-left transition-all ${
                        level === l ? 'scale-[1.02]' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ borderColor: HAZARD_META[l].color, background: level === l ? HAZARD_META[l].color + '22' : 'transparent' }}
                    >
                      <span className="text-[10px] font-semibold" style={{ color: HAZARD_META[l].color }}>L{l} · {HAZARD_META[l].label}</span>
                      <span className="text-[9px] leading-tight text-muted-foreground">{HAZARD_META[l].desc}</span>
                    </button>
                  ))}
                </div>

                {level !== 0 && (
                  <div className="animate-fade-in mt-2 space-y-1.5">
                    <button
                      onClick={finishZone}
                      disabled={draft.length < 3}
                      className="flex w-full items-center justify-center gap-1.5 border border-hazard-1/60 bg-hazard-1/10 py-1.5 text-[10px] tracking-wider text-hazard-1 transition-colors hover:bg-hazard-1/20 disabled:opacity-40"
                    >
                      <Icon name="Check" size={12} /> ЗАВЕРШИТЬ ЗОНУ
                    </button>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button onClick={undoPoint} disabled={!draft.length} className="flex items-center justify-center gap-1 border border-border py-1.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40">
                        <Icon name="Undo2" size={11} /> ТОЧКА
                      </button>
                      <button onClick={cancelDraft} className="flex items-center justify-center gap-1 border border-border py-1.5 text-[10px] text-muted-foreground transition-colors hover:text-hazard-4">
                        <Icon name="X" size={11} /> ОТМЕНА
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-sm border border-border bg-card p-3">
                <div className="mb-2 flex items-center justify-between text-[11px] tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Icon name="Activity" size={13} /> СВОДКА</span>
                  <div className="flex gap-2">
                    <button onClick={removeLastZone} disabled={!total} className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-40">← ЗОНА</button>
                    <button onClick={() => setZones([])} className="text-[10px] text-muted-foreground hover:text-hazard-4">СБРОС</button>
                  </div>
                </div>
                {LEVELS.map((l) => (
                  <div key={l} className="mb-1.5">
                    <div className="mb-0.5 flex justify-between text-[10px]">
                      <span style={{ color: HAZARD_META[l].color }}>L{l}</span>
                      <span className="text-muted-foreground">{stats[l]}</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full transition-all" style={{ width: total ? `${(stats[l] / total) * 100}%` : '0%', background: HAZARD_META[l].color }} />
                    </div>
                  </div>
                ))}
                <div className="mt-3 border-t border-border pt-2 text-center">
                  <div className="font-display text-3xl font-semibold text-foreground">{total}</div>
                  <div className="text-[9px] tracking-widest text-muted-foreground">ЗОН УГРОЗЫ НА КАРТЕ</div>
                </div>
              </div>
            </aside>
          </section>
        </main>
      ) : (
        <main className="mx-auto max-w-[1500px] px-4 py-6">
          {tab === 'method' && (
            <section className="animate-fade-in mx-auto max-w-4xl space-y-5">
              <SectionTitle icon="FlaskConical" title="Методология и критерии" sub="Классификация уровней опасности" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Оценка риска строится на композитном индексе конвективной неустойчивости (CAPE), сдвига ветра, вероятности осадков
                и данных наземных спотеров. Каждой зоне присваивается один из четырёх уровней — от L1 до L4.
              </p>
              <div className="overflow-x-auto rounded-sm border border-border">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-secondary text-[10px] tracking-widest text-muted-foreground">
                    <tr>
                      <th className="p-2.5">УРОВЕНЬ</th><th className="p-2.5">CAPE</th><th className="p-2.5">ВЕТЕР</th><th className="p-2.5">ВЕРОЯТНОСТЬ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CRITERIA.map((c) => (
                      <tr key={c.lvl} className="border-t border-border">
                        <td className="p-2.5"><span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[1px]" style={{ background: HAZARD_META[c.lvl].color }} /><span style={{ color: HAZARD_META[c.lvl].color }}>L{c.lvl} {HAZARD_META[c.lvl].label}</span></span></td>
                        <td className="p-2.5 text-muted-foreground">{c.cape}</td>
                        <td className="p-2.5 text-muted-foreground">{c.wind}</td>
                        <td className="p-2.5 text-muted-foreground">{c.prob}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === 'team' && (
            <section className="animate-fade-in mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center text-center">
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-sm border border-hazard-1/50">
                <div className="animate-radar absolute inset-0 origin-center" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, hsl(158 64% 45% / 0.5) 40deg, transparent 60deg)' }} />
                <Icon name="Radar" size={40} className="relative text-hazard-1" />
              </div>
              <div className="text-[11px] tracking-[0.4em] text-hazard-1">METEOROLOGICAL TEAM</div>
              <h2 className="mt-2 font-display text-5xl font-semibold tracking-widest sm:text-6xl">S.S.M.P team</h2>
              <div className="mt-4 text-[11px] tracking-widest text-muted-foreground">СООБЩЕСТВО МЕТЕОРОЛОГОВ-ЛЮБИТЕЛЕЙ</div>
            </section>
          )}

          {tab === 'stats' && (
            <section className="animate-fade-in mx-auto max-w-4xl space-y-5">
              <SectionTitle icon="BarChart3" title="Статистика по регионам" sub="Распределение уровней опасности" />
              <div className="grid gap-3 sm:grid-cols-4">
                {LEVELS.map((l) => (
                  <div key={l} className="rounded-sm border border-border bg-card p-4" style={{ borderColor: HAZARD_META[l].color + '55' }}>
                    <div className="font-display text-4xl font-semibold" style={{ color: HAZARD_META[l].color }}>{stats[l]}</div>
                    <div className="mt-1 text-[10px] tracking-widest text-muted-foreground">L{l} · {HAZARD_META[l].label}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-sm border border-border bg-card p-4">
                <div className="mb-3 text-[11px] tracking-widest text-muted-foreground">АКТИВНОСТЬ ПО РЕГИОНАМ</div>
                {[
                  { r: 'Восточная Европа', v: 72 }, { r: 'Центральная Азия', v: 48 },
                  { r: 'Южная Сибирь', v: 61 }, { r: 'Дальний Восток', v: 39 }, { r: 'Южная Азия', v: 55 },
                ].map((x) => (
                  <div key={x.r} className="mb-2.5">
                    <div className="mb-1 flex justify-between text-[11px]"><span>{x.r}</span><span className="text-muted-foreground">{x.v}%</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-hazard-1" style={{ width: `${x.v}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'archive' && (
            <section className="animate-fade-in mx-auto max-w-4xl space-y-5">
              <SectionTitle icon="Archive" title="Архив наблюдений" sub="История зафиксированных зон опасности" />
              <div className="overflow-x-auto rounded-sm border border-border">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-secondary text-[10px] tracking-widest text-muted-foreground">
                    <tr><th className="p-2.5">ДАТА</th><th className="p-2.5">ПУНКТ</th><th className="p-2.5">УР.</th><th className="p-2.5">ЯВЛЕНИЕ</th><th className="p-2.5 text-right">СПОТЕР</th></tr>
                  </thead>
                  <tbody>
                    {ARCHIVE.map((a, i) => (
                      <tr key={i} className="border-t border-border hover:bg-secondary/40">
                        <td className="p-2.5 text-muted-foreground">{a.date}</td>
                        <td className="p-2.5">{a.city}</td>
                        <td className="p-2.5"><span className="rounded-[2px] px-1.5 py-0.5 text-[10px]" style={{ background: HAZARD_META[a.lvl].color + '22', color: HAZARD_META[a.lvl].color }}>L{a.lvl}</span></td>
                        <td className="p-2.5 text-muted-foreground">{a.event}</td>
                        <td className="p-2.5 text-right text-hazard-1">{a.obs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      )}

      <footer className="mx-auto max-w-[1900px] border-t border-border px-4 py-4 text-[10px] tracking-widest text-muted-foreground">
        S.S.M.P team © 2026 · СООБЩЕСТВО МЕТЕОРОЛОГОВ-ЛЮБИТЕЛЕЙ · НЕ ЯВЛЯЕТСЯ ОФИЦИАЛЬНЫМ ИСТОЧНИКОМ ПРОГНОЗОВ
      </footer>
    </div>
  );
}

function SectionTitle({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="border-l-2 border-hazard-1 pl-3">
      <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-hazard-1"><Icon name={icon} size={13} /> {sub.toUpperCase()}</div>
      <h2 className="font-display text-2xl font-semibold tracking-wide">{title}</h2>
    </div>
  );
}
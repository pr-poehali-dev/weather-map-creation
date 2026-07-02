import { useState, useMemo } from 'react';
import EurasiaMap, { HazardLevel, HAZARD_META, CITIES } from '@/components/EurasiaMap';
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

const TEAM = [
  { call: 'STORM-01', name: 'А. Волков', role: 'Ведущий синоптик', region: 'Вост. Европа' },
  { call: 'CIRRUS-04', name: 'М. Лаутнер', role: 'Аналитик мезомасштаба', region: 'Центр. Азия' },
  { call: 'DELTA-09', name: 'К. Соколова', role: 'Спотер / полевой', region: 'Юж. Сибирь' },
  { call: 'NIMBUS-02', name: 'Т. Ямада', role: 'Оператор радара', region: 'Дальний Восток' },
];

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

export default function Index() {
  const [tab, setTab] = useState<TabId>('map');
  const [zones, setZones] = useState<Record<string, HazardLevel>>({ msk: 3, nsk: 4, ist: 2, del: 1, pek: 2 });
  const [level, setLevel] = useState<HazardLevel>(3);

  const handleCity = (id: string) => {
    setZones((prev) => {
      const next = { ...prev };
      if (level === 0) delete next[id];
      else if (prev[id] === level) delete next[id];
      else next[id] = level;
      return next;
    });
  };

  const stats = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    Object.values(zones).forEach((l) => (counts[l] = (counts[l] || 0) + 1));
    return counts;
  }, [zones]);

  const total = Object.keys(zones).length;

  return (
    <div className="min-h-screen bg-background text-foreground scanline">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-sm border border-hazard-1/60">
              <div className="animate-radar absolute inset-0 origin-center" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, hsl(158 64% 45% / 0.5) 40deg, transparent 60deg)' }} />
              <Icon name="Radar" size={18} className="relative text-hazard-1" />
            </div>
            <div className="leading-none">
              <div className="font-display text-lg font-semibold tracking-widest">METEO·WATCH</div>
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
        <nav className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-3 pb-2">
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

      <main className="mx-auto max-w-[1500px] px-4 py-5">
        {tab === 'map' && (
          <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
            {/* MAP */}
            <div className="animate-fade-in relative overflow-hidden rounded-sm border border-border bg-[hsl(0_0%_5%)]">
              <div className="flex items-center justify-between border-b border-border px-3 py-2 text-[11px] text-muted-foreground">
                <span>КАРТА · {total} АКТИВНЫХ ЗОН</span>
                <span className="text-hazard-1">◉ TRACKING</span>
              </div>
              <div className="relative aspect-[820/560] w-full">
                <EurasiaMap zones={zones} onCityClick={handleCity} activeLevel={level} />

                {/* LEGEND — правый нижний угол */}
                <div className="absolute bottom-3 right-3 w-[188px] rounded-sm border border-border bg-background/90 p-3 backdrop-blur">
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
                  <Icon name="Crosshair" size={13} /> УРОВЕНЬ ЗОНЫ
                </div>
                <p className="mb-3 text-[10px] leading-relaxed text-muted-foreground">
                  Выбери уровень и кликай по городам на радаре, чтобы разметить опасные зоны.
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
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
                <button
                  onClick={() => setLevel(0)}
                  className={`mt-2 flex w-full items-center justify-center gap-1.5 border py-1.5 text-[10px] tracking-wider transition-colors ${
                    level === 0 ? 'border-foreground/50 bg-secondary text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name="Eraser" size={12} /> РЕЖИМ УДАЛЕНИЯ
                </button>
              </div>

              <div className="rounded-sm border border-border bg-card p-3">
                <div className="mb-2 flex items-center justify-between text-[11px] tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Icon name="Activity" size={13} /> СВОДКА</span>
                  <button onClick={() => setZones({})} className="text-[10px] text-muted-foreground hover:text-hazard-4">СБРОС</button>
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
                  <div className="text-[9px] tracking-widest text-muted-foreground">ЗОН НА КАРТЕ · {CITIES.length} ПУНКТОВ</div>
                </div>
              </div>
            </aside>
          </section>
        )}

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
          <section className="animate-fade-in mx-auto max-w-4xl space-y-5">
            <SectionTitle icon="Users" title="Команда наблюдателей" sub="Метеорологи-любители METEO·WATCH" />
            <div className="grid gap-3 sm:grid-cols-2">
              {TEAM.map((m) => (
                <div key={m.call} className="rounded-sm border border-border bg-card p-4 transition-colors hover:border-hazard-1/50">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base tracking-widest text-hazard-1">{m.call}</span>
                    <Icon name="RadioTower" size={16} className="text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-sm">{m.name}</div>
                  <div className="text-[11px] text-muted-foreground">{m.role}</div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] tracking-wider text-muted-foreground"><Icon name="MapPin" size={11} /> {m.region}</div>
                </div>
              ))}
            </div>
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

      <footer className="mx-auto max-w-[1500px] border-t border-border px-4 py-4 text-[10px] tracking-widest text-muted-foreground">
        METEO·WATCH © 2026 · СООБЩЕСТВО МЕТЕОРОЛОГОВ-ЛЮБИТЕЛЕЙ · НЕ ЯВЛЯЕТСЯ ОФИЦИАЛЬНЫМ ИСТОЧНИКОМ ПРОГНОЗОВ
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

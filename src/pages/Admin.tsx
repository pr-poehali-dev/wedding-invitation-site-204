import { useEffect, useState } from "react";

const API = "https://functions.poehali.dev/90c475ab-fff7-43cf-939b-b30c86ebe79a";
const PASSWORD = "oxana2026";

interface Guest {
  id: number;
  name: string;
  drinks: string[];
  allergies: string | null;
  created_at: string;
}

function formatDate(dt: string) {
  return new Date(dt).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

type SortKey = "name" | "date" | "drinks";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [filterDrink, setFilterDrink] = useState<string>("all");

  const login = () => {
    if (pwd === PASSWORD) { setAuth(true); } else { setError("Неверный пароль"); }
  };

  const load = () => {
    setLoading(true);
    fetch(API)
      .then(r => r.json())
      .then(data => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        setGuests(parsed.guests || []);
      })
      .catch(() => setError("Ошибка загрузки"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (auth) load(); }, [auth]);

  const drinkStats: Record<string, number> = {};
  guests.forEach(g => g.drinks?.forEach(d => { drinkStats[d] = (drinkStats[d] || 0) + 1; }));
  const sortedDrinks = Object.entries(drinkStats).sort((a, b) => b[1] - a[1]);
  const allDrinkNames = Object.keys(drinkStats);
  const withAllergies = guests.filter(g => g.allergies);

  const filtered = filterDrink === "all" ? guests : guests.filter(g => g.drinks?.includes(filterDrink));

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "name") return a.name.localeCompare(b.name, "ru");
    if (sortKey === "date") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortKey === "drinks") return (b.drinks?.length || 0) - (a.drinks?.length || 0);
    return 0;
  });

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#faf9f7] font-montserrat flex items-center justify-center px-6">
        <div className="w-full max-w-xs text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400 mb-6 font-light">Результаты опроса</p>
          <h1 className="font-cormorant text-4xl font-light text-stone-800 mb-8">Оксана &amp; Даниил</h1>
          <div className="flex flex-col gap-3">
            <input
              type="password"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="Пароль"
              className="w-full border-b border-stone-200 bg-transparent py-2 text-sm text-stone-700 placeholder-stone-300 font-light outline-none focus:border-stone-500 transition-colors text-center"
            />
            {error && <p className="text-xs text-red-400 font-light">{error}</p>}
            <button
              onClick={login}
              className="mt-2 border border-stone-300 text-stone-600 py-3 text-[10px] tracking-[0.25em] uppercase font-light hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all duration-300"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] font-montserrat flex justify-center">
      <div className="w-full max-w-sm py-12 px-6">

        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.35em] uppercase text-stone-400 mb-2 font-light">Результаты опроса</p>
          <h1 className="font-cormorant text-4xl font-light text-stone-800">Оксана &amp; Даниил</h1>
          <button onClick={load} className="mt-3 text-[10px] tracking-[0.2em] uppercase text-stone-400 underline font-light">
            Обновить
          </button>
        </div>

        {loading && <p className="text-center text-stone-400 text-sm font-light">Загрузка...</p>}

        {!loading && (
          <>
            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 text-center border border-stone-100">
                <p className="font-cormorant text-4xl font-light text-stone-800">{guests.length}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 mt-1 font-light">Ответов</p>
              </div>
              <div className="bg-white p-4 text-center border border-stone-100">
                <p className="font-cormorant text-4xl font-light text-stone-800">{withAllergies.length}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 mt-1 font-light">С аллергией</p>
              </div>
            </div>

            {/* Напитки — статистика */}
            {sortedDrinks.length > 0 && (
              <div className="bg-white border border-stone-100 p-5 mb-6">
                <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-light mb-4">Напитки</p>
                <div className="space-y-3">
                  {sortedDrinks.map(([drink, count]) => (
                    <div key={drink}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-stone-600 font-light">{drink}</span>
                        <span className="text-xs text-stone-400 font-light">{count} чел.</span>
                      </div>
                      <div className="h-px bg-stone-100">
                        <div className="h-px bg-stone-400 transition-all duration-700" style={{ width: `${(count / guests.length) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Аллергии */}
            {withAllergies.length > 0 && (
              <div className="bg-white border border-stone-100 p-5 mb-6">
                <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-light mb-4">Аллергии</p>
                <div className="space-y-2">
                  {withAllergies.map(g => (
                    <div key={g.id} className="flex justify-between items-start gap-2">
                      <span className="text-xs text-stone-600 font-light">{g.name}</span>
                      <span className="text-xs text-red-400 font-light text-right">{g.allergies}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Список гостей с сортировкой и фильтром */}
            <div className="bg-white border border-stone-100 p-5">
              <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-light mb-4">Все ответы</p>

              {/* Сортировка */}
              <div className="flex gap-2 mb-4">
                {([["date", "По дате"], ["name", "По имени"], ["drinks", "По напиткам"]] as [SortKey, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSortKey(key)}
                    className={`px-2 py-1 text-[9px] tracking-[0.1em] uppercase font-light border transition-all ${
                      sortKey === key ? "bg-stone-800 text-white border-stone-800" : "border-stone-200 text-stone-400 hover:border-stone-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Фильтр по напитку */}
              {allDrinkNames.length > 0 && (
                <div className="mb-4">
                  <p className="text-[9px] tracking-[0.15em] uppercase text-stone-300 font-light mb-2">Фильтр по напитку</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setFilterDrink("all")}
                      className={`px-2 py-1 text-[9px] tracking-[0.1em] uppercase font-light border transition-all ${
                        filterDrink === "all" ? "bg-stone-800 text-white border-stone-800" : "border-stone-200 text-stone-400 hover:border-stone-400"
                      }`}
                    >
                      Все
                    </button>
                    {allDrinkNames.map(d => (
                      <button
                        key={d}
                        onClick={() => setFilterDrink(d)}
                        className={`px-2 py-1 text-[9px] tracking-[0.1em] uppercase font-light border transition-all ${
                          filterDrink === d ? "bg-stone-800 text-white border-stone-800" : "border-stone-200 text-stone-400 hover:border-stone-400"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {guests.length === 0 && (
                <p className="text-sm text-stone-400 font-light text-center py-4">Пока никто не ответил</p>
              )}

              <div className="space-y-4">
                {sorted.map(g => (
                  <div key={g.id} className="border-b border-stone-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-cormorant text-lg text-stone-800">{g.name}</span>
                      <span className="text-[9px] text-stone-300 font-light mt-1">{formatDate(g.created_at)}</span>
                    </div>
                    {g.drinks?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {g.drinks.map(d => (
                          <span key={d} className="text-[9px] px-2 py-0.5 border border-stone-200 text-stone-500 font-light">{d}</span>
                        ))}
                      </div>
                    )}
                    {g.allergies && (
                      <p className="text-[10px] text-red-400 font-light mt-1">⚠ {g.allergies}</p>
                    )}
                  </div>
                ))}
              </div>

              {filtered.length === 0 && guests.length > 0 && (
                <p className="text-xs text-stone-400 font-light text-center py-2">Нет гостей с выбранным напитком</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

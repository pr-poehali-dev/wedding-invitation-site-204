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

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = () => {
    if (pwd === PASSWORD) { setAuth(true); } else { setError("Неверный пароль"); }
  };

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    fetch(API)
      .then(r => r.json())
      .then(data => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        setGuests(parsed.guests || []);
      })
      .catch(() => setError("Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, [auth]);

  const drinkStats: Record<string, number> = {};
  guests.forEach(g => g.drinks?.forEach(d => { drinkStats[d] = (drinkStats[d] || 0) + 1; }));
  const sortedDrinks = Object.entries(drinkStats).sort((a, b) => b[1] - a[1]);
  const withAllergies = guests.filter(g => g.allergies);

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
        </div>

        {loading && <p className="text-center text-stone-400 text-sm font-light">Загрузка...</p>}

        {!loading && (
          <>
            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 text-center border border-stone-100">
                <p className="font-cormorant text-4xl font-light text-stone-800">{guests.length}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 mt-1 font-light">Ответов</p>
              </div>
              <div className="bg-white p-4 text-center border border-stone-100">
                <p className="font-cormorant text-4xl font-light text-stone-800">{withAllergies.length}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 mt-1 font-light">С аллергией</p>
              </div>
            </div>

            {/* Напитки */}
            {sortedDrinks.length > 0 && (
              <div className="bg-white border border-stone-100 p-5 mb-6">
                <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-light mb-4">Напитки</p>
                <div className="space-y-2">
                  {sortedDrinks.map(([drink, count]) => (
                    <div key={drink} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-stone-600 font-light">{drink}</span>
                          <span className="text-xs text-stone-400 font-light">{count}</span>
                        </div>
                        <div className="h-px bg-stone-100">
                          <div
                            className="h-px bg-stone-400 transition-all duration-700"
                            style={{ width: `${(count / guests.length) * 100}%` }}
                          />
                        </div>
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
                      <span className="text-xs text-stone-400 font-light text-right">{g.allergies}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Список гостей */}
            <div className="bg-white border border-stone-100 p-5">
              <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-light mb-4">Все ответы</p>
              {guests.length === 0 && (
                <p className="text-sm text-stone-400 font-light text-center py-4">Пока никто не ответил</p>
              )}
              <div className="space-y-4">
                {guests.map(g => (
                  <div key={g.id} className="border-b border-stone-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-cormorant text-lg text-stone-800">{g.name}</span>
                      <span className="text-[9px] text-stone-300 font-light mt-1">{formatDate(g.created_at)}</span>
                    </div>
                    {g.drinks?.length > 0 && (
                      <p className="text-[10px] text-stone-500 font-light">{g.drinks.join(", ")}</p>
                    )}
                    {g.allergies && (
                      <p className="text-[10px] text-red-400 font-light mt-0.5">⚠ {g.allergies}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

const HERO_PHOTO = "https://cdn.poehali.dev/projects/82e5d578-9946-42c2-9851-2b63210d5717/bucket/625acbf9-024d-4d3a-9005-2e0ba06608d1.png";
const COUPLE_PHOTO = "https://cdn.poehali.dev/projects/82e5d578-9946-42c2-9851-2b63210d5717/bucket/297f51a6-9ae2-4781-b00b-f556e63e6eda.jpg";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const Divider = () => (
  <div className="flex items-center gap-4 my-2">
    <div className="flex-1 h-px bg-stone-200" />
    <span className="text-stone-300 text-xs tracking-[0.3em]">◇</span>
    <div className="flex-1 h-px bg-stone-200" />
  </div>
);

function Countdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    function update() {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = Math.max(0, target - now);
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const items = [
    { value: time.d, label: "дней" },
    { value: time.h, label: "часов" },
    { value: time.m, label: "минут" },
    { value: time.s, label: "секунд" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map(({ value, label }) => (
        <div key={label} className="text-center">
          <p className="font-cormorant text-[clamp(2rem,6vw,3.5rem)] font-light leading-none">
            {String(value).padStart(2, "0")}
          </p>
          <p className="text-xs tracking-[0.15em] uppercase text-stone-500 mt-2 font-light">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f7] font-montserrat text-stone-700">

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${HERO_PHOTO})`,
            backgroundPosition: "center 30%",
            opacity: 0.22,
            filter: "grayscale(20%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f7]/60 via-transparent to-[#faf9f7]" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1.2s ease 0.1s, transform 1.2s ease 0.1s",
            }}
          >
            <p className="text-xs tracking-[0.35em] uppercase text-stone-400 mb-8 font-montserrat font-light">
              Приглашение на свадьбу
            </p>
          </div>

          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 1.2s ease 0.4s, transform 1.2s ease 0.4s",
            }}
          >
            <h1 className="font-cormorant font-light text-[clamp(3rem,10vw,6.5rem)] leading-none text-stone-800 tracking-tight">
              Оксана
              <span className="block text-[clamp(1.5rem,5vw,3rem)] text-stone-400 font-light tracking-[0.2em] my-3">
                &amp;
              </span>
              Даниил
            </h1>
          </div>

          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 1.4s ease 0.9s",
            }}
          >
            <div className="flex items-center gap-4 mt-10 mb-10">
              <div className="flex-1 h-px bg-stone-300" />
              <p className="font-cormorant italic text-stone-500 text-xl tracking-wider">
                22 августа 2026
              </p>
              <div className="flex-1 h-px bg-stone-300" />
            </div>
          </div>

          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 1.2s ease 1.2s, transform 1.2s ease 1.2s",
            }}
          >
            <p className="text-stone-400 text-sm tracking-[0.2em] uppercase font-light">
              Прокрутите вниз
            </p>
            <div className="mt-3 flex justify-center">
              <div className="w-px h-10 bg-gradient-to-b from-stone-300 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Photo */}
      <section className="py-20 px-6">
        <FadeSection className="max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute -inset-3 border border-stone-200" />
            <img
              src={COUPLE_PHOTO}
              alt="Оксана и Даниил"
              className="w-full aspect-[4/5] object-cover"
              style={{ filter: "grayscale(15%)" }}
            />
          </div>
        </FadeSection>
      </section>

      {/* Date & Time */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <FadeSection>
            <p className="text-xs tracking-[0.35em] uppercase text-stone-400 mb-6 font-light">Дата торжества</p>
            <h2 className="font-cormorant text-[clamp(2.5rem,7vw,4.5rem)] font-light text-stone-800 leading-tight">
              22 августа
            </h2>
            <p className="font-cormorant italic text-2xl text-stone-500 mt-1">2026 года</p>

            <Divider />

            <div className="mt-8 grid grid-cols-1 gap-6 text-center">
              <div>
                <p className="font-cormorant text-4xl font-light text-stone-800">15:30</p>
                <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mt-1 font-light">Сбор гостей</p>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Venue */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <FadeSection>
            <p className="text-xs tracking-[0.35em] uppercase text-stone-400 mb-6 font-light">Место проведения</p>
            <h2 className="font-cormorant text-4xl font-light text-stone-800 mb-3">
              Ресторан «Променад»
            </h2>

            <Divider />

            <p className="text-stone-500 mt-6 leading-relaxed font-light text-sm tracking-wide">
              г. Самара, ул. Советская Армия, д. 180/3
            </p>

            <a
              href="https://yandex.ru/maps/-/CPts4Ik9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8 border border-stone-300 text-stone-600 px-8 py-3 text-xs tracking-[0.25em] uppercase font-light hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all duration-300"
            >
              Маршрут на карте
            </a>
          </FadeSection>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-20 px-6 bg-stone-800 text-white">
        <div className="max-w-xl mx-auto text-center">
          <FadeSection>
            <p className="text-xs tracking-[0.35em] uppercase text-stone-400 mb-8 font-light">До нашего дня</p>
            <Countdown targetDate="2026-08-22" />
          </FadeSection>
        </div>
      </section>

      {/* Names & Story */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <FadeSection className="text-center">
            <blockquote className="font-cormorant italic text-2xl text-stone-600 leading-relaxed font-light">
              «Даниил обещал дарить цветы, а Оксана — не пилить по пустякам.<br className="hidden md:block" />
              Приходите посмотреть на людей, которые наивно в это верят!»
            </blockquote>

            <Divider />

            <div className="mt-10 grid grid-cols-2 gap-12">
              <div className="text-center">
                <p className="font-cormorant text-5xl font-light text-stone-800">Оксана</p>
                <p className="text-stone-400 text-xs tracking-[0.2em] uppercase mt-2 font-light">Невеста</p>
              </div>
              <div className="text-center">
                <p className="font-cormorant text-5xl font-light text-stone-800">Даниил</p>
                <p className="text-stone-400 text-xs tracking-[0.2em] uppercase mt-2 font-light">Жених</p>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Contacts */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <FadeSection>
            <p className="text-xs tracking-[0.35em] uppercase text-stone-400 mb-6 font-light">Контакты</p>
            <h2 className="font-cormorant text-3xl font-light text-stone-800 mb-2">Будем рады вашему присутствию</h2>
            <p className="text-stone-400 text-sm font-light mb-10 tracking-wide">
              По всем вопросам обращайтесь к невесте
            </p>

            <Divider />

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-stone-400 font-light mb-1">Оксана</p>
                <a href="tel:+79170172193" className="font-cormorant text-2xl text-stone-700 hover:text-stone-900 transition-colors">
                  +7 (917) 017-21-93
                </a>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-stone-100 text-center">
        <p className="font-cormorant italic text-xl text-stone-400">Оксана &amp; Даниил · 22.08.2026</p>
        <p className="text-xs text-stone-300 mt-2 tracking-wider font-light">С любовью ждём вас</p>
      </footer>
    </div>
  );
}
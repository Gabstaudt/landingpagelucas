"use client";

import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { LogoMark } from "@/components/LogoMark";

const practices = [
  ["01", "Direito Civil", "Orientação e atuação em contratos, responsabilidade civil e questões patrimoniais."],
  ["02", "Direito de Família e Sucessões", "Acompanhamento em questões familiares, inventários e planejamento sucessório com atenção a cada contexto."],
  ["03", "Direito do Consumidor", "Assessoria em relações de consumo, revisão de cobranças e resolução de conflitos."],
  ["04", "Direito do Trabalho", "Orientação sobre relações de trabalho e atuação em demandas e negociações trabalhistas."],
  ["05", "Direito Empresarial", "Suporte jurídico para empresas em contratos, organização societária e decisões do negócio."],
  ["06", "Direito Tributário", "Consultoria, planejamento e atuação em questões fiscais nas esferas administrativa e judicial."]
];

const insights = [
  ["CONTRATOS", "Clareza antes de assumir um compromisso.", "Pontos de atenção na análise de obrigações, prazos e responsabilidades."],
  ["FAMÍLIA E SUCESSÕES", "Planejar hoje para cuidar do amanhã.", "Organização patrimonial e diálogo para decisões familiares mais conscientes."],
  ["EMPRESAS", "O jurídico presente nas decisões do negócio.", "Prevenção de conflitos e organização das relações comerciais."]
];

const fade = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .2 }, transition: { duration: .75, ease: [0.2, 0.8, 0.2, 1] as const } };

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const menuButton = useRef<HTMLButtonElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollY, { stiffness: 70, damping: 25 });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 25 });
  const footerSlot = useRef<HTMLDivElement>(null);
  const [dock, setDock] = useState({ size: 560, scale: .1, x: 0, y: 0, scroll: 1 });
  const dockProgress = useTransform(smoothScroll, [Math.max(700, dock.scroll - 320), Math.max(701, dock.scroll - 2)], [0, 1]);
  const travelScale = useTransform(smoothScroll, [0, 700], [1, .20]);
  const travelX = useTransform(smoothScroll, [0, 700], [96, 0]);
  const travelY = useTransform(smoothScroll, [0, 700], [80, 0]);
  const symbolScale = useTransform(() => travelScale.get() + (dock.scale - travelScale.get()) * dockProgress.get());
  const symbolX = useTransform(() => travelX.get() + (dock.x - travelX.get()) * dockProgress.get());
  const symbolY = useTransform(() => travelY.get() + (dock.y - travelY.get()) * dockProgress.get());
  const symbolRotate = useTransform(smoothProgress, [0, 1], [0, 360]);
  const floatingOpacity = useTransform(dockProgress, [0, .8, 1], [.14, .14, 0]);

  useEffect(() => {
    const measure = () => {
      if (!footerSlot.current) return;
      const rect = footerSlot.current.getBoundingClientRect();
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const size = Math.min(window.innerWidth * (window.innerWidth < 640 ? .7 : .46), 560);
      setDock({ size, scale: rect.width / size, x: rect.right - window.innerWidth + 16, y: rect.bottom + window.scrollY - maxScroll - window.innerHeight + 16, scroll: maxScroll });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    if (footerSlot.current) observer.observe(footerSlot.current);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
    };
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (breakpoint.matches) setMenuOpen(false); };
    window.addEventListener("keydown", close);
    breakpoint.addEventListener("change", closeOnDesktop);
    return () => { window.removeEventListener("keydown", close); breakpoint.removeEventListener("change", closeOnDesktop); };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), reducedMotion ? 0 : 2200);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <AnimatePresence>
      {loading && (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-[#EFF3F0]" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45 }} aria-hidden="true">
          <AnimatedLogo />
        </motion.div>
      )}

      </AnimatePresence>

      <motion.div aria-hidden="true" style={{ opacity: reducedMotion ? 0 : floatingOpacity }} className="pointer-events-none fixed inset-0 z-20 overflow-hidden mix-blend-difference">
        <motion.div
          data-scroll-logo
          style={{ x: reducedMotion ? 0 : symbolX, y: reducedMotion ? 0 : symbolY, scale: reducedMotion ? .20 : symbolScale, transformOrigin: "bottom right" }}
          className="absolute bottom-4 right-4 w-[min(70vw,560px)] sm:w-[min(46vw,560px)]"
        >
          <motion.div style={{ rotate: reducedMotion ? 0 : symbolRotate }}>
            <LogoMark className="w-full" light />
          </motion.div>
        </motion.div>
      </motion.div>

      <header className="fixed left-1/2 top-4 z-50 w-[min(1180px,calc(100%-40px))] -translate-x-1/2 rounded-md border border-white/10 px-4 py-3 glass">
        <div className="flex items-center justify-between gap-4">
          <a href="#hero" aria-label="L R Ferreira Advocacia — início" className="shrink-0" onClick={() => setMenuOpen(false)}>
            <Image src="/assets/brand/horizontal-dark.svg" alt="L R Ferreira Advocacia" width={1200} height={388} priority className="h-auto w-[156px] sm:w-[184px] lg:w-[200px]" />
          </a>
          <button ref={menuButton} className="menu-toggle lg:hidden" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="main-navigation">
            <span className={menuOpen ? "menu-line menu-line-open-first" : "menu-line"} />
            <span className={menuOpen ? "menu-line menu-line-open-last" : "menu-line"} />
          </button>
          <nav id="main-navigation" aria-label="Navegação principal" className={`main-navigation ${menuOpen ? "is-open" : ""}`} onClick={event => { if ((event.target as HTMLElement).closest("a")) setMenuOpen(false); }}>
            <a href="#atuacao">Atuação</a><a href="#metodo">Método</a><a href="#insights">Insights</a><a href="#sobre">Sobre</a>
            <a href="#contato" className="rounded-sm border border-white/15 px-4 py-2">Agendar conversa</a>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-[#0E2F36] text-[#EFF3F0]">
          <div className="container-shell flex min-h-[100svh] items-center pt-36 pb-16">
            <div className="relative z-10 max-w-4xl">
              <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 2.25 }} className="mb-5 inline-block text-sm tracking-[.32em] text-[#A9BDB5]">ADVOCACIA E CONSULTORIA</motion.span>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 2.35, duration: .75 }} className="font-newsreader text-balance text-[clamp(2.9rem,8.5vw,7.2rem)] leading-[.92] tracking-[-.04em]">Segurança jurídica<br/>em cada decisão.</motion.h1>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 2.5, duration: .7 }} className="mt-6 max-w-2xl text-lg leading-8 text-white/75">Orientação jurídica para pessoas e empresas, com escuta atenta, clareza e uma atuação dedicada a cada situação.</motion.p>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 2.65, duration: .7 }} className="mt-8 flex flex-wrap gap-3">
                <a href="#contato" className="rounded-sm bg-[#EFF3F0] px-6 py-3 text-[#0E2F36] transition hover:-translate-y-0.5">Agendar uma conversa</a>
                <a href="#atuacao" className="rounded-sm border border-white/15 px-6 py-3 transition hover:bg-white/5">Conhecer a atuação</a>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-[#EFF3F0] py-28">
          <div className="container-shell grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <motion.div {...fade}>
              <span className="mb-4 inline-block text-sm tracking-[.3em] text-[#2F6168]">POSICIONAMENTO</span>
              <h2 className="font-newsreader text-balance text-[clamp(2.7rem,5vw,4.5rem)] leading-[1] tracking-[-.03em]">Cada situação tem uma história. Cada decisão merece orientação.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#294047]">Na L R Ferreira, a atuação começa pela compreensão do que importa para você. Aliamos análise técnica, diálogo e planejamento para orientar pessoas e empresas na prevenção e na resolução de questões jurídicas.</p>
            </motion.div>
            <motion.figure {...fade} className="overflow-hidden rounded-md shadow-[0_30px_80px_rgba(7,28,34,.18)]">
              <Image src="/assets/meeting.png" alt="Reunião com análise de documentos" width={1672} height={941} className="h-full w-full object-cover" sizes="(min-width: 1024px) 560px, calc(100vw - 40px)" />
            </motion.figure>
          </div>
        </section>

        <section id="atuacao" className="bg-[#F7FAF8] py-28">
          <div className="container-shell">
            <motion.div {...fade} className="max-w-3xl">
              <span className="mb-4 inline-block text-sm tracking-[.3em] text-[#2F6168]">ÁREAS DE ATUAÇÃO</span>
              <h2 className="font-newsreader text-[clamp(2.6rem,5vw,4.3rem)] leading-none tracking-[-.03em]">Diferentes áreas do Direito. Atenção a cada necessidade.</h2>
            </motion.div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {practices.map(([n,t,d], i) => <motion.article key={t} {...fade} transition={{ ...fade.transition, delay: i*.04 }} className="min-h-64 rounded-md border border-[#0E2F36]/10 bg-[#EFF3F0] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(7,28,34,.10)]"><span className="text-sm tracking-[.24em] text-[#2F6168]">{n}</span><h3 className="font-newsreader mt-6 text-3xl">{t}</h3><p className="mt-4 leading-7 text-[#294047]">{d}</p></motion.article>)}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0E2F36] py-28 text-[#EFF3F0]">
          <div className="container-shell relative z-10">
            <motion.div {...fade} className="max-w-4xl">
              <span className="mb-4 inline-block text-sm tracking-[.3em] text-white/60">MANIFESTO</span>
              <h2 className="font-newsreader text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-[-.04em]">Estrutura antes da decisão.</h2>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">Decisões que envolvem seus direitos, sua família, seu patrimônio ou sua empresa merecem atenção. Nosso compromisso é compreender o contexto, apresentar caminhos com clareza e acompanhar cada etapa com responsabilidade.</p>
            </motion.div>
          </div>
        </section>

        <section id="sobre" className="bg-[#EFF3F0] py-28">
          <div className="container-shell grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <motion.div {...fade}>
              <span className="mb-4 inline-block text-sm tracking-[.3em] text-[#2F6168]">SOBRE</span>
              <h2 className="font-newsreader text-[clamp(2.6rem,5vw,4.3rem)] leading-none">Lucas Ruan Ferreira Gomes</h2>
              <p className="mt-3 text-sm tracking-[.16em] text-[#2F6168]">ADVOGADO · ASSESSORIA JURÍDICA</p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#294047]">Atuação voltada a pessoas e empresas que buscam orientação jurídica em diferentes momentos da vida. O trabalho combina análise técnica e atendimento próximo para compreender cada demanda e construir caminhos adequados, com linguagem clara e responsabilidade.</p>
            </motion.div>
            <motion.div {...fade} className="rounded-md border border-[#0E2F36]/10 bg-white/40 p-7 shadow-[0_20px_50px_rgba(7,28,34,.08)]"><span className="text-xs tracking-[.25em] text-[#2F6168]">DIRETRIZ</span><p className="font-newsreader mt-4 text-3xl">“Orientação próxima. Atuação responsável.”</p><div className="mt-8 grid gap-4 text-sm"><div className="border-t border-[#0E2F36]/10 pt-4"><span className="block text-[#2F6168]">Nome institucional</span><strong>L R Ferreira</strong></div><div className="border-t border-[#0E2F36]/10 pt-4"><span className="block text-[#2F6168]">Atuação</span><strong>Advocacia e consultoria jurídica</strong></div><div className="border-t border-[#0E2F36]/10 pt-4"><span className="block text-[#2F6168]">Abordagem</span><strong>Estratégica, precisa e discreta</strong></div></div></motion.div>
          </div>
        </section>

        <section id="metodo" className="bg-[#F7FAF8] py-28">
          <div className="container-shell">
            <motion.div {...fade} className="max-w-3xl"><span className="mb-4 inline-block text-sm tracking-[.3em] text-[#2F6168]">MÉTODO</span><h2 className="font-newsreader text-[clamp(2.6rem,5vw,4.3rem)] leading-none">Um processo claro para orientar decisões complexas.</h2></motion.div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["01","Compreender","Sua história, seu contexto e seus objetivos."],["02","Estruturar","Caminhos jurídicos, riscos e possibilidades."],["03","Decidir","Recomendação técnica com segurança."],["04","Acompanhar","Implementação, ajustes e continuidade."]].map(([n,t,d]) => <motion.div key={n} {...fade} className="rounded-md border border-[#0E2F36]/10 bg-[#EFF3F0] p-7"><span className="text-sm tracking-[.22em] text-[#2F6168]">{n}</span><h3 className="font-newsreader mt-6 text-3xl">{t}</h3><p className="mt-4 leading-7 text-[#294047]">{d}</p></motion.div>)}</div>
          </div>
        </section>

        <section id="insights" className="bg-[#EFF3F0] py-28">
          <div className="container-shell">
            <motion.div {...fade} className="max-w-3xl"><span className="mb-4 inline-block text-sm tracking-[.3em] text-[#2F6168]">INSIGHTS</span><h2 className="font-newsreader text-[clamp(2.6rem,5vw,4.3rem)] leading-none">Conteúdo para quem precisa decidir com base.</h2></motion.div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{insights.map(([tag,t,d]) => <motion.article key={t} {...fade} className="flex min-h-72 flex-col rounded-md border border-[#0E2F36]/10 bg-white/35 p-7"><span className="text-xs tracking-[.22em] text-[#2F6168]">{tag}</span><h3 className="font-newsreader mt-5 text-3xl">{t}</h3><p className="mt-4 leading-7 text-[#294047]">{d}</p><a href="#contato" className="mt-auto pt-8">Ler mais</a></motion.article>)}</div>
          </div>
        </section>

        <section id="contato" className="bg-[#0E2F36] py-28 text-[#EFF3F0]">
          <div className="container-shell">
            <motion.div {...fade} className="grid gap-10 rounded-md border border-white/10 bg-white/[.03] p-5 sm:p-8 lg:grid-cols-[1.1fr_.9fr] lg:p-12">
              <div><span className="mb-4 inline-block text-sm tracking-[.3em] text-white/60">CONTATO</span><h2 className="font-newsreader text-[clamp(2.8rem,6vw,5rem)] leading-none">Uma decisão importante começa por uma análise bem estruturada.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">Converse sobre o seu cenário e entenda os caminhos possíveis com segurança jurídica.</p></div>
              <div className="lg:pt-8"><a href="mailto:lrferreira.adv@outlook.com" className="inline-flex rounded-sm bg-[#EFF3F0] px-6 py-3 text-[#0E2F36]">Agendar uma conversa</a><div className="mt-8 grid gap-4 text-sm"><div><span className="block text-white/50">E-mail</span><a href="mailto:lrferreira.adv@outlook.com">lrferreira.adv@outlook.com</a></div><div><span className="block text-white/50">WhatsApp</span><a href="https://wa.me/5591991831921">+55 91 99183-1921</a></div><div><span className="block text-white/50">Site</span><a href="https://lrferreira.adv.br">lrferreira.adv.br</a></div></div></div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#0E2F36]/10 bg-[#E3EBE7] py-10">
        <div className="container-shell flex flex-col items-center gap-6 text-center">
          <div className="relative w-56 sm:w-64">
            <Image src="/assets/brand/horizontal-light.svg" alt="L R Ferreira Advocacia" width={1200} height={388} className="h-auto w-full" />
            {/* Match the symbol's original bounds within the horizontal SVG. */}
            <div ref={footerSlot} data-logo-dock className="pointer-events-none absolute left-[-0.3275%] top-[7.353%] aspect-square w-[27.604%]" aria-hidden="true" />
          </div>
          <p className="text-xs leading-6 text-[#294047] sm:text-sm">© {new Date().getFullYear()} L R Ferreira. Todos os direitos reservados.</p>
        </div>
      </footer>
    </MotionConfig>
  );
}

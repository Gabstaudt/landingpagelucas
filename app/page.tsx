"use client";

import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { ProcessExplorer } from "@/components/ProcessExplorer";
import { ContactGuide } from "@/components/ContactGuide";
import { Disclosure } from "@/components/Disclosure";
import { LogoMark } from "@/components/LogoMark";

const practices = [
  ["01", "Direito Civil", "Orientação e atuação em contratos, responsabilidade civil e questões patrimoniais."],
  ["02", "Direito de Família e Sucessões", "Acompanhamento em questões familiares, inventários e planejamento sucessório com atenção a cada contexto."],
  ["03", "Direito do Consumidor", "Assessoria em relações de consumo, revisão de cobranças e resolução de conflitos."],
  ["04", "Direito do Trabalho", "Orientação sobre relações de trabalho e atuação em demandas e negociações trabalhistas."],
  ["05", "Direito Empresarial", "Suporte jurídico para empresas em contratos, organização societária e decisões do negócio."],
  ["06", "Direito Tributário", "Consultoria, planejamento e atuação em questões fiscais nas esferas administrativa e judicial."]
];

const practiceTopics = [
  ["Análise e elaboração de contratos", "Responsabilidade civil", "Questões patrimoniais"],
  ["Questões familiares", "Inventários e partilhas", "Planejamento sucessório"],
  ["Revisão de cobranças", "Problemas com produtos e serviços", "Conflitos nas relações de consumo"],
  ["Análise de relações de trabalho", "Demandas trabalhistas", "Negociações e acordos"],
  ["Contratos comerciais", "Organização societária", "Prevenção de conflitos empresariais"],
  ["Consultoria e planejamento fiscal", "Demandas administrativas", "Discussões judiciais tributárias"]
];

const faqs = [
  ["Como iniciar o atendimento?", "Entre em contato por WhatsApp ou e-mail e apresente brevemente sua demanda. Esse primeiro contato permite compreender o assunto e organizar os próximos passos do atendimento."],
  ["O que reunir para a primeira conversa?", "Tenha em mãos um resumo dos fatos, as datas relevantes e os documentos relacionados ao assunto. Se houver algum prazo em andamento, informe isso já no primeiro contato."],
  ["Como são definidos os honorários?", "Os honorários consideram a natureza da demanda, sua complexidade e o escopo da atuação. Entre em contato para conversar sobre o atendimento e as condições aplicáveis ao seu caso."]
];

const insights = [
  ["CONTRATOS", "Clareza antes de assumir um compromisso.", "Pontos de atenção na análise de obrigações, prazos e responsabilidades."],
  ["FAMÍLIA E SUCESSÕES", "Planejar hoje para cuidar do amanhã.", "Organização patrimonial e diálogo para decisões familiares mais conscientes."],
  ["EMPRESAS", "O jurídico presente nas decisões do negócio.", "Prevenção de conflitos e organização das relações comerciais."]
];

const fade = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .2 }, transition: { duration: .65, ease: [0.2, 0.8, 0.2, 1] as const } };

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
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
  const travelOpacity = useTransform(smoothScroll, [0, 600], [.14, .045]);
  const floatingOpacity = useTransform(() => travelOpacity.get() * (1 - dockProgress.get()));

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
      const current = sections.filter(section => section.getBoundingClientRect().top <= 180).pop();
      setActiveSection(current?.id ?? "hero");
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

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

      <motion.div aria-hidden="true" style={{ opacity: reducedMotion || activeSection === "contato" || activeSection === "duvidas" ? 0 : floatingOpacity }} className="scroll-symbol pointer-events-none fixed inset-0 z-20 overflow-hidden mix-blend-difference">
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

      <AnimatePresence>
        {!loading && activeSection !== "hero" && activeSection !== "contato" && <motion.a
          href="https://wa.me/5591991831921?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20um%20atendimento%20jur%C3%ADdico."
          className="quick-contact"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : 20 }} transition={{ duration: .3 }}
        ><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-9 9 10 10 0 0 1-4-.9L3 21l1.4-4.7A9 9 0 1 1 21 11.5Z" /><path d="M8 10h8M8 14h5" /></svg><span>Falar com o advogado</span><span aria-hidden="true">↗</span></motion.a>}
      </AnimatePresence>

      <header className="fixed left-1/2 top-4 z-50 w-[min(1180px,calc(100%-40px))] -translate-x-1/2 rounded-sm border border-white/20 px-4 py-3 glass">
        <motion.div aria-hidden="true" className="reading-progress" style={{ scaleX: scrollYProgress }} />
        <div className="flex items-center justify-between gap-4">
          <a href="#hero" aria-label="L R Ferreira Advocacia — início" className="shrink-0" onClick={() => setMenuOpen(false)}>
            <Image src="/assets/brand/horizontal-dark.svg" alt="L R Ferreira Advocacia" width={1200} height={388} priority className="h-auto w-[156px] sm:w-[184px] lg:w-[200px]" />
          </a>
          <button ref={menuButton} className="menu-toggle lg:hidden" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="main-navigation">
            <span className={menuOpen ? "menu-line menu-line-open-first" : "menu-line"} />
            <span className={menuOpen ? "menu-line menu-line-open-last" : "menu-line"} />
          </button>
          <nav id="main-navigation" aria-label="Navegação principal" className={`main-navigation ${menuOpen ? "is-open" : ""}`} onClick={event => { if ((event.target as HTMLElement).closest("a")) setMenuOpen(false); }}>
            {[["atuacao", "Atuação"], ["sobre", "Sobre"], ["metodo", "Método"], ["insights", "Conteúdo"]].map(([id, label]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} className="navigation-link">{label}</a>)}
            <a href="#contato" className="institutional-button rounded-sm border border-white/30 px-4 py-2">Agendar atendimento</a>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <section id="hero" className="hero-section relative min-h-[100svh] overflow-hidden bg-[#0E2F36] text-[#EFF3F0]">
          <div className="hero-light" aria-hidden="true" />
          <motion.div aria-hidden="true" className="hero-architecture" initial={reducedMotion ? false : { opacity: 0, scaleY: .8 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: reducedMotion ? 0 : 2.3, duration: 1.6, ease: "easeOut" }} />
          <div className="container-shell hero-shell relative z-10">
            <div className="hero-copy max-w-4xl">
              <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 2.25 }} className="hero-eyebrow section-label mb-5 inline-flex items-center gap-4 text-sm tracking-[.32em] text-[#A9BDB5]">ADVOCACIA E CONSULTORIA</motion.span>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 2.35, duration: .75 }} className="font-newsreader text-balance text-[clamp(2.9rem,8.5vw,7.2rem)] leading-[.92] tracking-[-.04em]">Segurança jurídica<br/><span className="hero-title-accent">em cada decisão.</span></motion.h1>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 2.5, duration: .7 }} className="mt-7 max-w-xl text-base leading-8 text-white/80 sm:text-lg">Assessoria jurídica para pessoas e empresas, com rigor técnico, discrição e compromisso com a defesa de seus interesses.</motion.p>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 2.65, duration: .7 }} className="mt-8 flex flex-wrap gap-3">
                <a href="#contato" className="institutional-button rounded-sm bg-[#EFF3F0] px-6 py-3 text-[#0E2F36]">Agendar atendimento <span aria-hidden="true" className="ml-5">↗</span></a>
                <a href="#atuacao" className="institutional-button rounded-sm border border-white/30 px-6 py-3">Conhecer a atuação</a>
              </motion.div>
            </div>
            <motion.div className="hero-signature" initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 2.9, duration: .8 }}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                <span className="hero-signature-name">LUCAS RUAN FERREIRA GOMES</span>
                <span className="text-xs tracking-[.1em] text-[#A9BDB5]">OAB/PA 43.942</span>
              </div>
              <a href="#atuacao" className="hero-explore"><span>Explore a atuação</span><span className="hero-scroll-line" aria-hidden="true" /></a>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#EFF3F0] py-28">
          <div className="container-shell grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <motion.div {...fade}>
              <span className="section-label mb-4 inline-block text-sm tracking-[.3em] text-[#2F6168]">O ESCRITÓRIO</span>
              <h2 className="font-newsreader text-balance text-[clamp(2.7rem,5vw,4.5rem)] leading-[1] tracking-[-.03em]">Conhecimento jurídico e responsabilidade em cada decisão.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#294047]">A L R Ferreira presta assessoria jurídica a pessoas e empresas, com análise criteriosa das particularidades de cada demanda. A atuação reúne conhecimento técnico, planejamento e comunicação clara na prevenção e na resolução de conflitos.</p>
            </motion.div>
            <motion.figure {...fade} className="institutional-image overflow-hidden rounded-sm border border-[#0E2F36]/15">
              <Image src="/assets/meeting.png" alt="Reunião com análise de documentos" width={1672} height={941} className="h-full w-full object-cover" sizes="(min-width: 1024px) 560px, calc(100vw - 40px)" />
            </motion.figure>
          </div>
        </section>

        <section id="atuacao" className="bg-[#F7FAF8] py-28">
          <div className="container-shell">
            <div className="practice-heading">
              <motion.div {...fade} className="max-w-3xl">
                <span className="section-label mb-4 inline-block text-sm tracking-[.3em] text-[#2F6168]">ÁREAS DE ATUAÇÃO</span>
                <h2 className="font-newsreader text-[clamp(2.6rem,5vw,4.3rem)] leading-none tracking-[-.03em]">Atuação jurídica com análise criteriosa e orientação clara.</h2>
              </motion.div>
              <motion.div {...fade} aria-hidden="true" className="hierarchy-detail">
                <Image src="/assets/visual/linhas-hierarquia.svg" width={600} height={120} alt="" className="h-auto w-full" />
              </motion.div>
            </div>
            <div className="practice-list">
              {practices.map(([n,t,d], i) => <motion.article key={t} {...fade} transition={{ ...fade.transition, delay: (i % 3)*.05 }} className="practice-row">
                <span className="practice-index">{n}</span>
                <h3 className="font-newsreader practice-name">{t}</h3>
                <div className="practice-description">
                  <p>{d}</p>
                  <Disclosure title="Como posso ajudar" context={t}>
                    <ul className="practice-topics">{practiceTopics[i].map(topic => <li key={topic}>{topic}</li>)}</ul>
                    <a href={`https://wa.me/5591991831921?text=${encodeURIComponent(`Olá, gostaria de agendar um atendimento sobre ${t}.`)}`} className="editorial-link mt-5 inline-block">Conversar sobre esta área <span aria-hidden="true">↗</span></a>
                  </Disclosure>
                </div>
              </motion.article>)}
            </div>
          </div>
        </section>

        <section className="commitment-section relative overflow-hidden bg-[#0E2F36] py-28 text-[#EFF3F0]">
          <div className="container-shell relative z-10">
            <motion.div {...fade} className="max-w-4xl">
              <span className="section-label mb-4 inline-block text-sm tracking-[.3em] text-white/60">COMPROMISSO</span>
              <h2 className="font-newsreader text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-[-.04em]">Estrutura antes da decisão.</h2>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">Decisões que envolvem seus direitos, sua família, seu patrimônio ou sua empresa merecem atenção. Nosso compromisso é compreender o contexto, apresentar caminhos com clareza e acompanhar cada etapa com responsabilidade.</p>
            </motion.div>
          </div>
        </section>

        <section id="sobre" className="about-section bg-[#EFF3F0] py-28">
          <div className="container-shell about-editorial">
            <motion.div {...fade} className="about-heading">
              <span className="section-label mb-5 inline-block text-[#2F6168]">SOBRE MIM</span>
              <h2 className="font-newsreader">Lucas Ruan<br className="hidden lg:block" /> Ferreira Gomes</h2>
              <p className="about-registration">ADVOGADO · OAB/PA 43.942</p>
            </motion.div>
            <motion.figure {...fade} transition={{ ...fade.transition, delay: .08 }} className="about-portrait">
              <div className="brand-portrait">
                <Image src="/lucas/fotolucas.jpg" alt="Lucas Ruan Ferreira Gomes, advogado inscrito na OAB/PA 43.942" width={3024} height={4032} sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, calc(100vw - 40px)" className="relative z-[1] aspect-[3/4] h-auto w-full object-cover" />
              </div>
              <figcaption><span>FORMAÇÃO EM DIREITO</span><span>UNAMA</span></figcaption>
            </motion.figure>
            <motion.div {...fade} transition={{ ...fade.transition, delay: .12 }} className="about-biography">
                <p>Lucas Ruan Ferreira Gomes é advogado, natural de Belém do Pará, e está à frente da L R Ferreira Advocacia. Aprovado no 44º Exame de Ordem ainda no 9º período da graduação, construiu sua trajetória com disciplina nos estudos e compromisso com a qualidade técnica, valores que hoje definem sua prática profissional.</p>
                <p>Seu trabalho une organização, proatividade e preparo: antecipar riscos, estruturar cada etapa cuidadosamente e fundamentar cada orientação com rigor. A comunicação é sempre clara e acessível, para que cada cliente compreenda seus direitos, suas alternativas e os próximos passos.</p>
              <div className="about-signature"><Image src="/assets/brand/horizontal-light.svg" alt="L R Ferreira Advocacia" width={1200} height={388} className="h-auto w-40" /><a href="#contato" className="editorial-link">Iniciar uma conversa <span aria-hidden="true">↗</span></a></div>
            </motion.div>
          </div>
        </section>

        <section id="metodo" className="method-section relative isolate overflow-hidden bg-[#F7FAF8] py-28">
          <div className="container-shell">
            <motion.div {...fade} className="max-w-3xl"><span className="section-label mb-4 inline-block text-sm tracking-[.3em] text-[#2F6168]">MÉTODO</span><h2 className="font-newsreader text-[clamp(2.6rem,5vw,4.3rem)] leading-none">Método e acompanhamento em cada etapa.</h2></motion.div>
            <motion.div {...fade} className="mt-10"><ProcessExplorer /></motion.div>
          </div>
        </section>

        <section id="insights" className="bg-[#EFF3F0] py-28">
          <div className="container-shell">
            <motion.div {...fade} className="max-w-3xl"><span className="section-label mb-4 inline-block text-sm tracking-[.3em] text-[#2F6168]">CONTEÚDO JURÍDICO</span><h2 className="font-newsreader text-[clamp(2.6rem,5vw,4.3rem)] leading-none">Informação jurídica para decisões conscientes.</h2></motion.div>
            <div className="insight-editorial">{insights.map(([tag,t,d], i) => <motion.article key={t} {...fade} transition={{ ...fade.transition, delay: i * .07 }} className={`insight-entry ${i === 0 ? "insight-lead" : ""}`}>
              <div className="insight-meta"><span>{tag}</span><span aria-hidden="true">0{i + 1}</span></div>
              <h3 className="font-newsreader">{t}</h3>
              <p>{d}</p>
              <a href={`https://wa.me/5591991831921?text=${encodeURIComponent(`Olá, gostaria de conversar sobre ${tag.toLowerCase()}: ${t}`)}`} className="editorial-link">Conversar sobre o tema <span aria-hidden="true">↗</span></a>
            </motion.article>)}</div>
          </div>
        </section>

        <section id="duvidas" className="bg-[#F7FAF8] py-28">
          <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <motion.div {...fade}>
              <span className="section-label mb-4 inline-block text-[#2F6168]">ANTES DO PRIMEIRO CONTATO</span>
              <h2 className="font-newsreader text-[clamp(2.6rem,5vw,4rem)] leading-none">Clareza desde o início.</h2>
              <p className="mt-6 leading-8 text-[#294047]">Entenda como iniciar o atendimento e organizar as informações sobre sua demanda.</p>
            </motion.div>
            <motion.div {...fade} className="faq-list">{faqs.map(([question, answer]) => <Disclosure key={question} title={question}><p className="leading-8 text-[#294047]">{answer}</p></Disclosure>)}</motion.div>
          </div>
        </section>

        <section id="contato" className="contact-section relative isolate overflow-hidden bg-[#0E2F36] py-28 text-[#EFF3F0]">
          <div className="container-shell">
            <motion.div {...fade} className="contact-section-heading"><span className="section-label">CONTATO</span><span>ATENÇÃO A CADA HISTÓRIA. CLAREZA EM CADA PASSO.</span></motion.div>
            <div className="contact-layout">
              <motion.div {...fade} className="contact-intro">
                <span className="section-label mb-4 inline-block text-[#A9BDB5]">SEU PRÓXIMO PASSO</span>
                <h2 className="font-newsreader text-[clamp(2.8rem,5.5vw,5rem)] leading-none">Vamos cuidar do que importa para você.</h2>
                <p className="mt-7 max-w-xl text-lg leading-8 text-white/75">Uma conversa para compreender sua demanda, organizar as informações e avaliar os próximos passos.</p>
                <div className="contact-lawyer">
                  <Image src="/lucas/fotolucas.jpg" alt="" width={3024} height={4032} sizes="64px" className="h-20 w-16 object-cover object-top" />
                  <div><p className="font-newsreader text-2xl">Lucas Ruan Ferreira Gomes</p><p className="mt-2 text-xs tracking-[.12em] text-[#A9BDB5]">ADVOGADO · OAB/PA 43.942</p></div>
                </div>
                <div className="contact-direct-details">
                  <a href="https://wa.me/5591991831921"><span>WhatsApp</span><span>+55 91 99183-1921 ↗</span></a>
                  <a href="mailto:lrferreira.adv@outlook.com"><span>E-mail</span><span>lrferreira.adv@outlook.com ↗</span></a>
                </div>
              </motion.div>
              <motion.div {...fade} transition={{ ...fade.transition, delay: .12 }} className="min-w-0"><ContactGuide /></motion.div>
            </div>
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

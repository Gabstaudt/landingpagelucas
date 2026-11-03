"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useRef, useState } from "react";

const steps = [
  { title: "Compreender", summary: "Sua história e seus objetivos.", heading: "Primeiro, compreender o que importa.", description: "O ponto de partida é conhecer sua demanda, o contexto e os documentos disponíveis. Uma escuta atenta permite identificar prioridades e as informações necessárias para a análise." },
  { title: "Estruturar", summary: "Análise e caminhos possíveis.", heading: "Uma análise que organiza o próximo passo.", description: "Os fatos e documentos são examinados para avaliar os caminhos jurídicos, os riscos e as possibilidades de atuação. Cada orientação considera as particularidades da demanda." },
  { title: "Decidir", summary: "Clareza para fazer escolhas.", heading: "Alternativas claras para decidir.", description: "A orientação apresenta as alternativas e os pontos de atenção em linguagem acessível. O objetivo é que você compreenda o cenário antes de definir os próximos passos." },
  { title: "Acompanhar", summary: "Atenção em cada etapa.", heading: "Atuação com continuidade e organização.", description: "Definido o escopo do trabalho, a atuação acompanha as etapas da demanda, com atenção aos documentos, às providências e às informações relevantes para o cliente." }
];

export function ProcessExplorer() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  return (
    <div className="process-explorer">
      <div role="tablist" aria-label="Etapas do atendimento" className="process-tabs">{steps.map((step, index) => <button key={step.title} ref={element => { buttons.current[index] = element; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={selected === index} aria-controls={`${id}-panel`} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % steps.length;
        else if (event.key === "ArrowLeft") next = (index + steps.length - 1) % steps.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = steps.length - 1;
        else return;
        event.preventDefault(); setSelected(next); buttons.current[next]?.focus();
      }}>
        <span className="process-step-number">0{index + 1}<span aria-hidden="true">{selected === index ? "−" : "+"}</span></span>
        <span className="font-newsreader process-step-title">{step.title}</span>
        <span className="process-step-summary">{step.summary}</span>
      </button>)}</div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${selected}`} tabIndex={0} className="process-panel">
        <AnimatePresence initial={false} mode="wait"><motion.div key={selected} initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }} transition={{ duration: reducedMotion ? 0 : .22 }} className="process-panel-content">
          <div><span className="section-label text-[#2F6168]">ETAPA 0{selected + 1} / 04</span><h3 className="font-newsreader mt-4 text-[clamp(1.9rem,3vw,2.6rem)]">{steps[selected].heading}</h3></div>
          <div><p className="leading-8 text-[#294047]">{steps[selected].description}</p><a href="#contato" className="editorial-link mt-5 inline-block">Vamos dar o primeiro passo <span aria-hidden="true">↗</span></a></div>
        </motion.div></AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

const areas = ["Civil e contratos", "Família e sucessões", "Consumidor", "Trabalho", "Empresarial", "Tributário", "Preciso de orientação"];
const purposes = ["Entender meus direitos", "Analisar um documento", "Tratar de uma demanda", "Outro assunto"];
const directContact = "https://wa.me/5591991831921?text=" + encodeURIComponent("Olá, gostaria de conversar sobre um atendimento jurídico.");

export function ContactGuide() {
  const [step, setStep] = useState(1);
  const [area, setArea] = useState("");
  const [purpose, setPurpose] = useState(purposes[0]);
  const [name, setName] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const message = `${name.trim() ? `Olá, meu nome é ${name.trim()}.` : "Olá!"} Gostaria de agendar um atendimento com Lucas Ruan Ferreira Gomes.\nAssunto: ${area || "Orientação jurídica"}.\nObjetivo: ${purpose}.\nPodemos conversar sobre os próximos passos?`;
  const goTo = (value: number) => {
    setStep(value);
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  };

  return (
    <div className="contact-guide">
      <div className="guide-progress" aria-hidden="true"><span className="is-complete" /><span className={step === 2 ? "is-complete" : ""} /></div>
      <div className="guide-kicker"><span>VAMOS CONVERSAR</span><span aria-live="polite">{step === 1 ? "01 / 02" : "02 / 02"}</span></div>
      <h3 ref={heading} tabIndex={-1} className="font-newsreader guide-heading">{step === 1 ? "Como posso ajudar você?" : "Um primeiro contato com clareza."}</h3>
      <AnimatePresence initial={false} mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }} transition={{ duration: reducedMotion ? 0 : .22 }}>
          {step === 1 ? <>
            <p className="guide-description">Escolha o assunto mais próximo da sua necessidade.</p>
            <fieldset className="guide-options"><legend className="sr-only">Assunto do atendimento</legend>{areas.map((item, index) => <label key={item} className={`guide-option ${area === item ? "is-selected" : ""}`}>
              <input type="radio" name="contact-area" value={item} checked={area === item} onChange={() => setArea(item)} />
              <span className="guide-option-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{item}</span><span className="guide-option-check" aria-hidden="true">{area === item ? "✓" : "↗"}</span>
            </label>)}</fieldset>
            <button type="button" className="institutional-button guide-primary" disabled={!area} onClick={() => goTo(2)}>Continuar <span aria-hidden="true">→</span></button>
            <a href={directContact} className="guide-skip">Prefiro ir direto ao WhatsApp ↗</a>
          </> : <>
            <button type="button" className="guide-back" onClick={() => goTo(1)}>← Alterar assunto: {area}</button>
            <fieldset className="guide-purposes"><legend>O que você procura?</legend>{purposes.map(item => <label key={item} className={purpose === item ? "is-selected" : ""}><input type="radio" name="contact-purpose" value={item} checked={purpose === item} onChange={() => setPurpose(item)} /><span>{item}</span></label>)}</fieldset>
            <label className="guide-name">Como posso chamar você? <span>(opcional)</span><input type="text" autoComplete="given-name" value={name} maxLength={60} onChange={event => setName(event.target.value)} placeholder="Seu nome" /></label>
            <div className="guide-preview"><span>SUA MENSAGEM INICIAL</span><p>{message}</p></div>
            <a href={`https://wa.me/5591991831921?text=${encodeURIComponent(message)}`} className="institutional-button guide-primary">Continuar no WhatsApp <span aria-hidden="true">↗</span></a>
            <a href={`mailto:lrferreira.adv@outlook.com?subject=${encodeURIComponent(`Atendimento jurídico — ${area}`)}&body=${encodeURIComponent(message)}`} className="guide-skip">Prefiro enviar por e-mail ↗</a>
            <p className="guide-note">Você poderá revisar a mensagem no WhatsApp antes de enviar.</p>
          </>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

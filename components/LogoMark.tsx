import Image from "next/image";

export function LogoMark({ className = "", light = false }: { className?: string; light?: boolean }) {
  return <Image src={`/assets/brand/symbol-${light ? "dark" : "light"}.svg`} width={1024} height={1024} alt="" aria-hidden="true" className={className} />;
}

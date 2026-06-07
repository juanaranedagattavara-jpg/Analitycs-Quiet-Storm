import { Hero } from "@/components/sections/Hero";
import { PorQueQSA } from "@/components/sections/PorQueQSA";
import { Productos } from "@/components/sections/Productos";
import { Industrias } from "@/components/sections/Industrias";
import { PruebaSocial } from "@/components/sections/PruebaSocial";
import { Segmentos } from "@/components/sections/Segmentos";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { Plataforma } from "@/components/sections/Plataforma";
import { FAQ } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";

export default function Home() {
  return (
    <>
      <Hero />
      <PorQueQSA />
      <Productos />
      <Industrias />
      <PruebaSocial />
      <Segmentos />
      <PricingTeaser />
      <Plataforma />
      <FAQ />
      <CTAFinal />
    </>
  );
}

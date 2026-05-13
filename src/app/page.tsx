import { Navigation } from "@/components/Navigation";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { Projet } from "@/sections/Projet";
import { TeteBlanche } from "@/sections/TeteBlanche";
import { Annee } from "@/sections/Annee";
import { Galerie } from "@/sections/Galerie";
import { Equipe } from "@/sections/Equipe";
import { Partenaires } from "@/sections/Partenaires";
import { Soutenir } from "@/sections/Soutenir";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <Projet />
        <TeteBlanche />
        <Annee />
        <Galerie />
        <Equipe />
        <Partenaires />
        <Soutenir />
      </main>
      <Footer />
    </>
  );
}

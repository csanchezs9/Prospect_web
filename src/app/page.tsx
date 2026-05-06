import Hero from "@/components/Hero";
import ClickScroll from "@/components/ClickScroll";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import WorkCta from "@/components/WorkCta";
import PersonalBrand from "@/components/PersonalBrand";
import About from "@/components/About";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <ClickScroll />
      <Marquee items={["Brand", "Web", "Product", "Motion", "Identity"]} />
      <Services />
      <WorkCta />
      <PersonalBrand />
      <About />
      <Cta />
      <Footer />
    </>
  );
}

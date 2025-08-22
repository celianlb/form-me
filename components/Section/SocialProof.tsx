import Heading from "../UI/Heading";
import PartnerSection from "./PartnerSection";
import Testimonials from "./Testimonials";

export default function SocialProof() {
  return (
    <section className="flex flex-col gap-[80px] md:gap-[100px] py-[80px]">
      <Heading className="px-[48px] md:px-[120px]" level={2}>
        Ils nous font confiances
      </Heading>
      <div className="flex flex-col gap-16">
        <PartnerSection />
        <Testimonials />
      </div>
    </section>
  );
}

import Image from "next/image";

export default function PartnerSection() {
  return (
    <div className="flex flex-col md:flex-row gap-16 justify-center items-center px-[48px] md:px-[120px]">
      <Image
        src={"/partners/fdm-logo.png"}
        alt="FDM"
        width={100}
        height={100}
        className="w-fit h-[32px] md:h-[50px] md:w-auto"
      />
      <Image
        src={"/partners/fosec-logo.png"}
        alt="Fosec"
        width={329}
        height={100}
        className="w-fit h-[32px] md:h-[50px] md:w-auto"
      />
      <Image
        src={"/partners/lysafe-logo.png"}
        alt="FDM"
        width={606}
        height={100}
        className="w-fit h-[32px] md:h-[50px] md:w-auto"
      />
      <Image
        src={"/partners/liva-logo.png"}
        alt="FDM"
        width={319}
        height={100}
        className="w-fit h-[32px] md:h-[50px] md:w-auto"
      />
    </div>
  );
}

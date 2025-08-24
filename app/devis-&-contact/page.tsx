import DevisContactForm from "@/components/DevisContactForm";
import Heading from "@/components/UI/Heading";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            trainings: {
              where: {
                isActive: true,
                status: "PUBLISHED",
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      trainingCount: category._count.trainings,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function DevisContactPage() {
  const categories = await getCategories();

  return (
    <main>
      <section className="px-5 relative lg:px-[120px] pt-[200px] pb-[80px] z-10">
        <div
          className="absolute w-full h-full bg-cover bg-top bg-no-repeat left-0 top-0 -z-20"
          style={{
            backgroundImage: "url('/hero/hero-dotted.png')",
          }}
        />
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Section informations de contact */}
          <div className="flex flex-col gap-8 lg:w-1/2">
            <Heading level={1}>
              Bienvenue sur notre formulaire de devis !
            </Heading>
            <div className="bg-white border w-fit border-primary/30 p-8 flex flex-col gap-8 rounded-[32px]">
              <div className="flex flex-col gap-4 md:flex-row justify-between">
                <div className="flex gap-4 items-center">
                  <Image
                    src={"/contact/Devis/mail.svg"}
                    width={40}
                    height={40}
                    alt="mail svg"
                  />
                  <p className="font-satoshi font-semibold text-darkBlue">
                    form.me@gmail.com
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <Image
                    src={"/contact/Devis/phone.svg"}
                    width={40}
                    height={40}
                    alt="phone svg"
                  />
                  <p className="font-satoshi font-semibold text-darkBlue">
                    +33 7 66 76 39 11
                  </p>
                </div>
              </div>
              <div className="text-sm text-grayBlue font-satoshi">
                <p>
                  Vous souhaitez obtenir un devis personnalisé pour une
                  formation ? Remplissez le formulaire ci-contre et nous vous
                  recontacterons rapidement avec une proposition adaptée à vos
                  besoins.
                </p>
              </div>
            </div>
          </div>

          {/* Section formulaire */}
          <div className="lg:w-2/3">
            <DevisContactForm categories={categories} />
          </div>
        </div>
      </section>
    </main>
  );
}

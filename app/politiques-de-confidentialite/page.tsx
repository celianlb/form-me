import Badge from "@/components/UI/Badge";
import Heading from "@/components/UI/Heading";

export default function PolitiquesConfidentialite() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="p-8 lg:p-12">
          <h1 className="text-4xl lg:text-5xl font-sora font-bold text-primary mb-8"></h1>
          <Heading level={1} className="mb-16 mx-auto w-full text-center">
            <Badge className="px-12 w-full">
              Politiques de confidentialité
            </Badge>
          </Heading>

          <div className="space-y-8 font-satoshi text-grayBlue">
            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Introduction
              </h2>
              <p className="leading-relaxed">
                Form.Me s&apos;engage à protéger votre vie privée. Cette
                politique de confidentialité explique comment nous collectons,
                utilisons et protégeons vos données personnelles lorsque vous
                utilisez notre site web et nos services.
              </p>
              <p className="leading-relaxed mt-4">
                En accédant à notre site ou en utilisant nos services, vous
                acceptez les pratiques décrites dans cette politique.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Données collectées
              </h2>
              <h3 className="text-lg text-primary font-sora font-bold tracking-tight mb-2">
                Données d&apos;identification
              </h3>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Numéro de téléphone</li>
                <li>Entreprise/Organisation</li>
              </ul>

              <h3 className="text-lg font-sora font-bold tracking-tight text-primary mb-2 mt-6">
                Données de connexion
              </h3>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Pages visitées et temps passé sur le site</li>
                <li>Date et heure de connexion</li>
              </ul>

              <h3 className="text-lg font-sora font-bold tracking-tight text-primary mb-2 mt-6">
                Données de formation
              </h3>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>Formations suivies et supports consultés</li>
                <li>Progression dans les formations</li>
                <li>Résultats d&apos;évaluations (le cas échéant)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Finalités du traitement
              </h2>
              <p className="leading-relaxed mb-4">
                Nous utilisons vos données personnelles pour :
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>Gérer votre accès aux supports de formation</li>
                <li>Personnaliser votre expérience utilisateur</li>
                <li>
                  Vous envoyer des informations relatives à nos formations
                </li>
                <li>Répondre à vos demandes de devis ou de contact</li>
                <li>Améliorer nos services et notre site web</li>
                <li>Respecter nos obligations légales</li>
                <li>Assurer la sécurité de notre plateforme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Base légale du traitement
              </h2>
              <p className="leading-relaxed">
                Le traitement de vos données personnelles est fondé sur :
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed mt-4">
                <li>
                  <strong>Votre consentement :</strong> pour l&apos;envoi
                  d&apos;informations commerciales
                </li>
                <li>
                  <strong>L&apos;exécution du contrat :</strong> pour
                  l&apos;accès aux formations
                </li>
                <li>
                  <strong>L&apos;intérêt légitime :</strong> pour
                  l&apos;amélioration de nos services
                </li>
                <li>
                  <strong>L&apos;obligation légale :</strong> pour la
                  conservation de certaines données
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Partage des données
              </h2>
              <p className="leading-relaxed">
                Nous ne vendons, ni ne louons, ni ne partageons vos données
                personnelles avec des tiers, sauf dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed mt-4">
                <li>Avec votre consentement explicite</li>
                <li>Pour se conformer à une obligation légale</li>
                <li>
                  Avec nos prestataires de services (hébergement, outils
                  d&apos;analyse) qui s&apos;engagent à protéger vos données
                </li>
                <li>
                  En cas de fusion, acquisition ou cession d&apos;actifs de
                  notre entreprise
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Conservation des données
              </h2>
              <p className="leading-relaxed">
                Vos données personnelles sont conservées pendant la durée
                nécessaire aux finalités pour lesquelles elles sont traitées :
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed mt-4">
                <li>
                  <strong>Données de compte :</strong> pendant toute la durée
                  d&apos;utilisation de nos services, puis 3 ans après la
                  dernière connexion
                </li>
                <li>
                  <strong>Données de formation :</strong> 5 ans pour répondre
                  aux obligations réglementaires
                </li>
                <li>
                  <strong>Données de contact :</strong> 3 ans après le dernier
                  contact
                </li>
                <li>
                  <strong>Logs de connexion :</strong> 12 mois maximum
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Sécurité des données
              </h2>
              <p className="leading-relaxed">
                Nous mettons en œuvre des mesures techniques et
                organisationnelles appropriées pour protéger vos données
                personnelles contre :
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed mt-4">
                <li>L&apos;accès non autorisé</li>
                <li>La divulgation, la modification ou la destruction</li>
                <li>La perte accidentelle</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Ces mesures incluent le chiffrement des données,
                l&apos;authentification sécurisée, la surveillance des accès et
                la formation de notre personnel.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Vos droits
              </h2>
              <p className="leading-relaxed mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>
                  <strong>Droit d&apos;accès :</strong> obtenir une copie de vos
                  données personnelles
                </li>
                <li>
                  <strong>Droit de rectification :</strong> corriger des données
                  inexactes
                </li>
                <li>
                  <strong>Droit à l&apos;effacement :</strong> demander la
                  suppression de vos données
                </li>
                <li>
                  <strong>Droit à la limitation :</strong> limiter le traitement
                  de vos données
                </li>
                <li>
                  <strong>Droit à la portabilité :</strong> récupérer vos
                  données dans un format structuré
                </li>
                <li>
                  <strong>Droit d&apos;opposition :</strong> vous opposer au
                  traitement de vos données
                </li>
                <li>
                  <strong>Droit de retrait du consentement :</strong> retirer
                  votre consentement à tout moment
                </li>
              </ul>
              <p className="leading-relaxed mt-4">
                Pour exercer ces droits, contactez-nous à :
                <a
                  href="mailto:form.me@gmail.com"
                  className="text-primary hover:underline ml-1"
                >
                  form.me@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Cookies et technologies similaires
              </h2>
              <p className="leading-relaxed">
                Notre site utilise des cookies pour améliorer votre expérience
                de navigation. Les cookies sont de petits fichiers stockés sur
                votre appareil qui nous permettent de :
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed mt-4">
                <li>Mémoriser vos préférences</li>
                <li>Analyser l&apos;utilisation du site</li>
                <li>Personnaliser le contenu</li>
                <li>Assurer la sécurité de la plateforme</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Vous pouvez configurer votre navigateur pour refuser les
                cookies, mais cela peut affecter le fonctionnement du site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Transferts internationaux
              </h2>
              <p className="leading-relaxed">
                Nos données sont hébergées chez Vercel (États-Unis). Ce
                prestataire offre des garanties appropriées pour la protection
                de vos données conformément aux standards européens.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Modifications de cette politique
              </h2>
              <p className="leading-relaxed">
                Cette politique de confidentialité peut être modifiée
                occasionnellement. Nous vous informerons de tout changement
                significatif par e-mail ou via une notification sur notre site
                web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-sora font-bold tracking-tight text-primary mb-4">
                Contact et réclamations
              </h2>
              <p className="leading-relaxed">
                Pour toute question concernant cette politique ou le traitement
                de vos données personnelles, contactez-nous :
              </p>
              <ul className="list-none space-y-2 leading-relaxed mt-4">
                <li>
                  <strong>Email :</strong> form.me@gmail.com
                </li>
                <li>
                  <strong>Téléphone :</strong> +33 7 66 76 39 11
                </li>
                <li>
                  <strong>Adresse :</strong> Claye Souilly
                </li>
              </ul>
              <p className="leading-relaxed mt-4">
                Si vous n&apos;êtes pas satisfait de notre réponse, vous avez le
                droit de déposer une réclamation auprès de la CNIL (Commission
                Nationale de l&apos;Informatique et des Libertés).
              </p>
            </section>

            <div className="pt-8 border-t border-darkBlue/20">
              <p className="text-sm text-grayBlue/70">
                Dernière mise à jour : 24/08/2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

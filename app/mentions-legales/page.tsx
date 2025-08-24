export default function MentionsLegales() {
  return (
    <div className="min-h-screen  pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className=" p-8 lg:p-12">
          <h1 className="text-4xl lg:text-5xl font-sora font-bold text-primary mb-8">
            Mentions Légales
          </h1>

          <div className="space-y-8 font-satoshi text-grayBlue">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Éditeur du site
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Nom de la société :</strong> Form.Me
                </p>
                <p>
                  <strong>Forme juridique :</strong> EURL
                </p>
                <p>
                  <strong>Capital social :</strong> 0€
                </p>
                <p>
                  <strong>Siège social :</strong> Claye Souilly
                </p>
                <p>
                  <strong>RCS :</strong> [Numéro à compléter]
                </p>
                <p>
                  <strong>SIRET :</strong> [Numéro à compléter]
                </p>
                <p>
                  <strong>Numéro de TVA intracommunautaire :</strong> [À
                  compléter]
                </p>
                <p>
                  <strong>Directeur de publication :</strong> [Nom à compléter]
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Contact
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Téléphone :</strong> +33 7 66 76 39 11
                </p>
                <p>
                  <strong>Email :</strong> form.me@gmail.com
                </p>
                <p>
                  <strong>Site web :</strong> www.forme.me
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Hébergement
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Hébergeur :</strong> Vercel
                </p>
                <p>
                  <strong>Adresse :</strong>650 California St, San Francisco, CA
                  94108, US
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Propriété intellectuelle
              </h2>
              <p className="leading-relaxed">
                L&apos;ensemble de ce site relève de la législation française et
                internationale sur le droit d&apos;auteur et la propriété
                intellectuelle. Tous les droits de reproduction sont réservés, y
                compris pour les documents téléchargeables et les
                représentations iconographiques et photographiques.
              </p>
              <p className="leading-relaxed mt-4">
                La reproduction de tout ou partie de ce site sur un support
                électronique quel qu&apos;il soit est formellement interdite
                sauf autorisation expresse du directeur de la publication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Responsabilité
              </h2>
              <p className="leading-relaxed">
                Les informations contenues sur ce site sont aussi précises que
                possible et le site remis à jour à différentes périodes de
                l&apos;année, mais peut toutefois contenir des inexactitudes ou
                des omissions.
              </p>
              <p className="leading-relaxed mt-4">
                Si vous constatez une lacune, erreur ou ce qui parait être un
                dysfonctionnement, merci de bien vouloir le signaler par email,
                à l&apos;adresse [email@forme.me], en décrivant le problème de
                la façon la plus précise possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Liens hypertextes
              </h2>
              <p className="leading-relaxed">
                Les sites internet peuvent proposer des liens vers d&apos;autres
                sites internet ou d&apos;autres ressources disponibles sur
                Internet. Form.Me ne dispose d&apos;aucun moyen pour contrôler
                les sites en connexion avec ses sites internet.
              </p>
              <p className="leading-relaxed mt-4">
                Form.Me ne répond pas de la disponibilité de tels sites et
                sources externes, ni ne la garantit. Elle ne peut être tenue
                pour responsable de tout dommage, de quelque nature que ce soit,
                résultant du contenu de ces sites ou sources externes, et
                notamment des informations, produits ou services qu&apos;ils
                proposent, ou de tout usage qui peut être fait de ces éléments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Protection des données personnelles
              </h2>
              <p className="leading-relaxed">
                Pour plus d&apos;informations sur la collecte et le traitement
                de vos données personnelles, nous vous invitons à consulter
                notre
                <a
                  href="/politiques-de-confidentialite"
                  className="text-primary hover:underline ml-1"
                >
                  Politique de confidentialité
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Cookies
              </h2>
              <p className="leading-relaxed">
                Le site peut-être amené à vous demander l&apos;acceptation des
                cookies pour des besoins de statistiques et d&apos;affichage. Un
                cookie est une information déposée sur votre disque dur par le
                serveur du site que vous visitez.
              </p>
              <p className="leading-relaxed mt-4">
                Vous pouvez configurer votre navigateur pour qu&apos;il vous
                informe de la réception de cookies et vous permettre de les
                refuser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Droit applicable
              </h2>
              <p className="leading-relaxed">
                Tant le présent site que les modalités et conditions de son
                utilisation sont régis par le droit français, quel que soit le
                lieu d&apos;utilisation. En cas de contestation éventuelle, et
                après l&apos;échec de toute tentative de recherche d&apos;une
                solution amiable, les tribunaux français seront seuls compétents
                pour connaître de ce litige.
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

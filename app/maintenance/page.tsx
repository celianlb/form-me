'use client';

import {
  getMaintenanceMessage,
  getMaintenanceReturnTime,
  getMaintenanceContactEmail,
} from '@/lib/maintenance';

export default function MaintenancePage() {
  const message = getMaintenanceMessage();
  const returnTime = getMaintenanceReturnTime();
  const contactEmail = getMaintenanceContactEmail();

  const formatReturnTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return null;
    }
  };

  const formattedReturnTime = returnTime ? formatReturnTime(returnTime) : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-white">
      {/* Background pattern - same as hero sections */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero/hero-dotted.png')",
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Main content */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-sora font-bold text-darkBlue mb-6">
            Maintenance en cours
          </h1>
          <p className="text-lg text-grayBlue font-satoshi leading-relaxed">
            {message}
          </p>
        </div>

        {/* Estimated return time */}
        {formattedReturnTime && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-10 border border-primary/10 shadow-sm">
            <p className="text-xs font-satoshi font-medium text-primary uppercase tracking-wide mb-1">
              Retour estimé
            </p>
            <p className="text-base font-satoshi font-semibold text-darkBlue">
              {formattedReturnTime}
            </p>
          </div>
        )}

        {/* Contact information */}
        <div className="space-y-3">
          <p className="text-sm font-satoshi text-grayBlue">
            Vous pouvez toujours nous contacter à :
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-block px-6 py-3 rounded-xl bg-primary text-white font-satoshi font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            {contactEmail}
          </a>
        </div>

        {/* Footer text */}
        <p className="text-xs text-grayBlue/60 font-satoshi mt-12">
          Merci de votre patience et de votre compréhension.
        </p>
      </div>
    </div>
  );
}

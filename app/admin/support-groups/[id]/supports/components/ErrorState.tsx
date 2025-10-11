import Button from "@/components/UI/Button";

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

export default function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-satoshi font-semibold text-darkBlue mb-2">
          {error || "Groupe non trouvé"}
        </h3>
        <Button onClick={onBack} variant="secondary">
          Retour aux groupes
        </Button>
      </div>
    </div>
  );
}

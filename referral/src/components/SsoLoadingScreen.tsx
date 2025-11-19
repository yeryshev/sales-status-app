import { Loader2 } from 'lucide-react';

export const SsoLoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="text-lg text-muted-foreground">Загрузка...</p>
    </div>
  );
};


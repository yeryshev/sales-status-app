import { AlertCircle } from 'lucide-react';

interface SsoErrorScreenProps {
  message?: string | null;
}

export const SsoErrorScreen = ({ message }: SsoErrorScreenProps) => {
  const handleRetry = () => {
    // Очищаем состояние и перезагружаем страницу
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#d9dfe2] shadow-lg">
        <div className="text-center p-6">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-[#ff4a50]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#092433] mb-2" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
            Ошибка авторизации
          </h2>
          <p className="text-[#092433] opacity-80 mb-4" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
            {message || 'Произошла ошибка при попытке авторизации через SSO'}
          </p>
        </div>
        <div className="text-center p-6 pt-0">
          <p className="text-sm text-[#092433] opacity-60 mb-6" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
            Пожалуйста, попробуйте обновить страницу или обратитесь к администратору.
          </p>
        </div>
        <div className="flex justify-center gap-3 p-6 pt-0">
          <button 
            onClick={handleRetry}
            className="bg-[#092433] hover:bg-[#0f3c55] text-white rounded-lg px-6 py-2 font-medium transition-colors cursor-pointer"
            style={{ fontFamily: "'Manrope', Arial, sans-serif" }}
          >
            Обновить страницу
          </button>
        </div>
      </div>
    </div>
  );
};

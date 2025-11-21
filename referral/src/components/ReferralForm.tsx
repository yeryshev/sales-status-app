import { useState, useEffect, useRef } from 'react';
import { useAuth } from 'react-oidc-context';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { createReferral, type CreateReferralData } from '@/lib/api';

interface ReferralFormProps {
  onSuccess: () => void;
  isLoading?: boolean;
}

export const ReferralForm = ({ onSuccess, isLoading = false }: ReferralFormProps) => {
  const auth = useAuth();
  const [isServercore, setIsServercore] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientTelegram, setClientTelegram] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const prevIsLoadingRef = useRef(isLoading);
  
  // Ошибки для отдельных полей
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Скрываем сообщение после обновления списка (когда isLoading переходит из true в false)
  useEffect(() => {
    if (success && prevIsLoadingRef.current && !isLoading) {
      // Список обновился (isLoading был true, стал false), скрываем сообщение
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 500); // Небольшая задержка для плавности
      return () => clearTimeout(timer);
    }
    prevIsLoadingRef.current = isLoading;
  }, [success, isLoading]);

  // Валидация email в реальном времени
  const validateEmail = (email: string): string => {
    if (!email.trim()) return '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Введите корректный email адрес';
    }
    return '';
  };

  // Валидация телефона в реальном времени
  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return '';
    
    // Убираем все кроме цифр и +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Проверяем формат: должен начинаться с + или цифры
    if (!/^[\d+]/.test(cleanPhone)) {
      return 'Номер должен начинаться с + или цифры';
    }
    
    // Проверяем что есть хотя бы 10 цифр
    const digitsOnly = cleanPhone.replace(/\+/g, '');
    if (digitsOnly.length < 10) {
      return 'Минимум 10 цифр';
    }
    
    return '';
  };

  // Обработчик изменения email
  const handleEmailChange = (value: string) => {
    setClientEmail(value);
    const error = validateEmail(value);
    setEmailError(error);
  };

  // Обработчик изменения телефона
  const handlePhoneChange = (value: string) => {
    setClientPhone(value);
    const error = validatePhone(value);
    setPhoneError(error);
  };

  const validateForm = (): boolean => {
    // Проверка обязательного поля client_name
    if (!clientName.trim()) {
      setError('Имя представителя клиента обязательно для заполнения');
      return false;
    }

    // Проверка что заполнено хотя бы одно контактное поле
    if (!clientPhone.trim() && !clientEmail.trim() && !clientTelegram.trim()) {
      setError('Необходимо заполнить хотя бы одно поле с контактными данными (телефон, почта или Telegram)');
      return false;
    }

    // Проверка обязательного поля description
    if (!description.trim()) {
      setError('Описание обязательно для заполнения');
      return false;
    }

    // Проверка чекбокса согласия
    if (!agreementAccepted) {
      setError('Необходимо подтвердить согласие на обработку персональных данных');
      return false;
    }

    // Проверка что нет ошибок валидации
    if (emailError) {
      setError('Исправьте ошибки в полях формы');
      return false;
    }

    if (phoneError) {
      setError('Исправьте ошибки в полях формы');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    const userId = auth.user?.profile?.eid as string;

    const data: CreateReferralData = {
      employee_inside_id: userId,
      is_servercore: isServercore,
      client_name: clientName.trim(),
      description: description.trim(),
      ...(clientPhone.trim() && { client_phone: clientPhone.trim() }),
      ...(clientEmail.trim() && { client_email: clientEmail.trim() }),
      ...(clientTelegram.trim() && { client_telegram: clientTelegram.trim() }),
    };

    const result = await createReferral(data);

    setIsSubmitting(false);

    if (result) {
      // Успех - очищаем форму
      setSuccess(true);
      setIsServercore(false);
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setClientTelegram('');
      setDescription('');
      setAgreementAccepted(false);
      setEmailError('');
      setPhoneError('');
      setError('');
      onSuccess();
    } else {
      // Ошибка
      setError('Возникла ошибка при отправке формы. Пожалуйста, обратитесь в Департамент по работе с клиентами.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
      {/* Выбор бренда */}
      <div className="space-y-1">
        <label htmlFor="brand" className="block text-[#092433] font-normal text-base">
          Бренд
        </label>
        <select
          id="brand"
          value={isServercore ? 'servercore' : 'selectel'}
          onChange={(e) => setIsServercore(e.target.value === 'servercore')}
          disabled={isSubmitting}
          className="brand-select w-full bg-white border border-[#d9dfe2] text-[#092433] rounded-[10px] px-4 h-12 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#092433] focus:ring-offset-0 text-base font-normal"
        >
          <option value="selectel">Selectel</option>
          <option value="servercore">Servercore</option>
        </select>
      </div>

      {/* Имя представителя клиента */}
      <div className="space-y-1">
        <label htmlFor="client-name" className="block text-[#092433] font-normal text-base">
          Имя представителя клиента <span className="text-[#ff4a50]">*</span>
        </label>
        <input
          id="client-name"
          type="text"
          placeholder="Иванов Иван"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-white border border-[#d9dfe2] text-[#092433] placeholder:text-[#092433]/40 rounded-[10px] px-4 h-12 focus:outline-none focus:ring-2 focus:ring-[#092433] focus:ring-offset-0 text-base font-normal"
        />
      </div>

      {/* Контактные данные */}
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-base font-normal text-[#092433]">
            Контактные данные <span className="text-[#ff4a50]">*</span>
          </p>
          <p className="text-xs md:text-sm text-[#092433] opacity-60">
            Заполните хотя бы одно поле
          </p>
        </div>

        <div className="space-y-1">
          <label htmlFor="client-phone" className="block text-[#092433] font-normal text-base">
            Телефон
          </label>
          <input
            id="client-phone"
            type="tel"
            placeholder="+7 999 999 99 99"
            value={clientPhone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            disabled={isSubmitting}
            className={`w-full bg-white border text-[#092433] placeholder:text-[#092433]/40 rounded-[10px] px-4 h-12 focus:outline-none focus:ring-2 focus:ring-[#092433] focus:ring-offset-0 text-base font-normal ${phoneError ? 'border-[#ff4a50]' : 'border-[#d9dfe2]'}`}
          />
          {phoneError && (
            <p className="text-xs text-[#ff4a50]">{phoneError}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="client-email" className="block text-[#092433] font-normal text-base">
            Email
          </label>
          <input
            id="client-email"
            type="email"
            placeholder="client@example.com"
            value={clientEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            disabled={isSubmitting}
            className={`w-full bg-white border text-[#092433] placeholder:text-[#092433]/40 rounded-[10px] px-4 h-12 focus:outline-none focus:ring-2 focus:ring-[#092433] focus:ring-offset-0 text-base font-normal ${emailError ? 'border-[#ff4a50]' : 'border-[#d9dfe2]'}`}
          />
          {emailError && (
            <p className="text-xs text-[#ff4a50]">{emailError}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="client-telegram" className="block text-[#092433] font-normal text-base">
            Telegram
          </label>
          <input
            id="client-telegram"
            type="text"
            placeholder="@username"
            value={clientTelegram}
            onChange={(e) => setClientTelegram(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-white border border-[#d9dfe2] text-[#092433] placeholder:text-[#092433]/40 rounded-[10px] px-4 h-12 focus:outline-none focus:ring-2 focus:ring-[#092433] focus:ring-offset-0 text-base font-normal"
          />
        </div>
      </div>

      {/* Описание */}
      <div className="space-y-1">
        <label htmlFor="description" className="block text-[#092433] font-normal text-base">
          Описание <span className="text-[#ff4a50]">*</span>
        </label>
        <textarea
          id="description"
          placeholder="Любая полезная информация о клиенте, проекте и предпочтительном способе связи"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          className="w-full bg-white border border-[#d9dfe2] text-[#092433] placeholder:text-[#092433]/40 rounded-[10px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#092433] focus:ring-offset-0 resize-none text-base font-normal"
        />
      </div>

      {/* Чекбокс согласия */}
      <div className="space-y-2">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="agreement-accepted"
            name="agreement-accepted"
            checked={agreementAccepted}
            onChange={(e) => setAgreementAccepted(e.target.checked)}
            disabled={isSubmitting}
            className="tilda-checkbox mt-1"
          />
          <span className="text-sm text-[#092433] leading-[14px]">
            Отправляя рекомендацию, вы подтверждаете факт уведомления вами представителя потенциального клиента об осуществлении обработки его персональных данных АО «Селектел» и его{' '}
            <a 
              href="https://docs.google.com/document/d/1X4aCUcQrYgTbMVEjS2StebnOlI-4x9b2eCBthaA9UeQ/edit?tab=t.0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#ee4348] hover:underline"
            >
              согласие на обработку данных
            </a>
            {' '}в соответствии с{' '}
            <a 
              href="https://files.selectel.ru/docs/ru/personal-data-processing-and-protection-policy.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#ee4348] hover:underline"
            >
              Политикой
            </a>
            .
          </span>
        </label>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-[#ff4a50] rounded-[10px] p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-[#ff4a50] flex-shrink-0 mt-0.5" />
          <p className="text-[#ff4a50]">{error}</p>
        </div>
      )}

      {/* Кнопка отправки */}
      <div className="flex justify-start pt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-[#eb4247] hover:bg-[#dc3035] text-white cursor-pointer rounded-[10px] w-[180px] h-12 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Отправка...
            </>
          ) : (
            'Отправить'
          )}
        </button>
      </div>
    </form>
    
    {/* Сообщение об успехе */}
    {success && (
      <div className="mt-4 bg-green-50 border border-green-500 rounded-[10px] p-4 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
        <p className="text-green-700">
          Рекомендация успешно создана! Обновляем список...
        </p>
      </div>
    )}
    </>
  );
};

import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { createReferral, type CreateReferralData } from '@/lib/api';

interface ReferralFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ReferralForm = ({ onSuccess, onCancel }: ReferralFormProps) => {
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
  
  // Ошибки для отдельных полей
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

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
      // Успех
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      // Ошибка
      setError('Возникла ошибка при отправке формы. Пожалуйста, обратитесь в Департамент по работе с клиентами.');
    }
  };

  if (success) {
    return (
      <Card className="border-green-500">
        <CardContent className="pt-6">
          <Alert className="border-green-500">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              Рекомендация успешно создана! Обновляем список...
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Форма рекомендации клиента</CardTitle>
        <CardDescription>
          Заполните информацию о потенциальном клиенте
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Выбор бренда */}
          <div className="space-y-2">
            <Label htmlFor="brand">Бренд</Label>
            <Select
              value={isServercore ? 'servercore' : 'selectel'}
              onValueChange={(value) => setIsServercore(value === 'servercore')}
            >
              <SelectTrigger id="brand">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selectel">Selectel</SelectItem>
                <SelectItem value="servercore">Servercore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Имя представителя клиента */}
          <div className="space-y-2">
            <Label htmlFor="client-name">
              Имя представителя клиента <span className="text-destructive">*</span>
            </Label>
            <Input
              id="client-name"
              placeholder="Иванов Иван"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Контактные данные */}
          <div className="space-y-4 rounded-lg border p-4">
            <p className="text-sm font-medium">
              Контактные данные <span className="text-destructive">*</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Заполните хотя бы одно поле
            </p>

            <div className="space-y-2">
              <Label htmlFor="client-phone">Телефон</Label>
              <Input
                id="client-phone"
                type="tel"
                placeholder="+7 999 999 99 99"
                value={clientPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                disabled={isSubmitting}
                className={phoneError ? 'border-destructive' : ''}
              />
              {phoneError && (
                <p className="text-xs text-destructive">{phoneError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-email">Email</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={isSubmitting}
                className={emailError ? 'border-destructive' : ''}
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-telegram">Telegram</Label>
              <Input
                id="client-telegram"
                placeholder="@username"
                value={clientTelegram}
                onChange={(e) => setClientTelegram(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Описание <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Любая полезная информация о клиенте, проекте и предпочтительном способе связи"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          {/* Ошибка */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Кнопки */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                'Отправить рекомендацию'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};


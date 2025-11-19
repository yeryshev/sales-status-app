import { Gift, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';
import { fetchUserDeals, type Deal } from '@/lib/api';
import { ReferralForm } from '@/components/ReferralForm';
import { logger } from '@/lib/logger';

export const ReferralPage = () => {
  const auth = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadDeals = async () => {
    if (auth.isAuthenticated && auth.user?.profile?.eid) {
      const userId = auth.user.profile.eid as string;
      logger.log('Loading deals for user:', userId);
      
      setIsLoading(true);
      const data = await fetchUserDeals(userId);
      setDeals(data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadDealsEffect = async () => {
      if (auth.isAuthenticated && auth.user?.profile?.eid) {
        const userId = auth.user.profile.eid as string;
        logger.log('Loading deals for user:', userId);
        
        setIsLoading(true);
        const data = await fetchUserDeals(userId);
        
        // Проверяем, что компонент все еще смонтирован перед обновлением состояния
        if (isMounted) {
          setDeals(data);
          setIsLoading(false);
        }
      } else {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDealsEffect();

    // Cleanup функция для предотвращения обновления состояния размонтированного компонента
    return () => {
      isMounted = false;
    };
  }, [auth.isAuthenticated, auth.user]);

  const handleFormSuccess = () => {
    setShowForm(false);
    loadDeals(); // Обновляем список после успешной отправки
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  // Функция для определения варианта badge по статусу
  const getStatusVariant = (status: string): 'default' | 'success' | 'destructive' | 'secondary' => {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('клиент') || lowerStatus.includes('client')) {
      return 'success';
    }
    if (lowerStatus.includes('отказ') || lowerStatus.includes('отклон') || lowerStatus.includes('reject')) {
      return 'destructive';
    }
    if (lowerStatus.includes('приостановлено') || lowerStatus.includes('pause') || lowerStatus.includes('hold')) {
      return 'secondary';
    }
    return 'default';
  };

  // Функция для форматирования даты из timestamp
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Функция для формирования ссылки на CRM
  const getCrmUrl = (deal: Deal): string => {
    const baseUrl = deal.isServercore 
      ? import.meta.env.VITE_SC_CRM 
      : import.meta.env.VITE_MAIN_CRM;
    return `${baseUrl}${deal.crmLeadId}`;
  };

  // Преобразование данных из API в формат для отображения
  const recommendations = deals.map((deal) => ({
    date: formatDate(deal.date),
    company: deal.title,
    engineer: deal.manager,
    status: deal.status,
    statusVariant: getStatusVariant(deal.status),
    crmUrl: getCrmUrl(deal),
  }));

  const steps = [
    {
      title: 'Подумай, кому мы можем помочь.',
      description: 'Это может быть родственник, знакомый из другой компании или просто человек, которому будут полезны услуги Selectel.',
    },
    {
      title: 'Расскажи им о нас.',
      description: 'Уточни есть ли темы для обсуждения, готовы ли они будут пообщаться поподробнее с коллегами.',
    },
    {
      title: 'Заполни форму и расскажи все подробности.',
      description: 'Укажи контакты потенциального клиента, чтобы коллеги из Департамента по работе с клиентами могли выйти на связь и уточнить запрос.',
    },
    {
      title: 'Дальше всё за нами.',
      description: 'Мы свяжемся, обсудим задачи, подготовим предложение. Актуальную информацию по статусу клиента ты сможешь уточнить на этом лендинге или напрямую у инженера технического сопровождения продаж, к которому перейдет твоя рекомендация.',
    },
    {
      title: 'Получи бонус!',
      description: 'Если из лида вырастет реальный клиент, ты получишь вознаграждение 💰 Выплата придет вместе с заработной платой через 3 месяца после выхода клиента на полную мощность потребления наших услуг.',
    },
  ];

  const faqItems = [
    {
      question: 'Можно ли получить бонус, если мой знакомый уже пользуется услугами Selectel?',
      answer: 'Нет, программа действует только для новых клиентов компании. Новыми считаются те клиенты, кто ранее не пользовался услугами Selectel.',
    },
    {
      question: 'Как узнать статус по моей рекомендации?',
      answer: 'В блоке "Мои рекомендации" отразится текущий статус сделки из CRM, а также ответственный за клиента инженер.',
    },
    {
      question: 'Если клиент воспользуется только тестовым периодом или только бонусными рублями?',
      answer: 'Мы не сможем выплатить вам бонус пока клиент не начнет приносить выручку. Выплата возможна только через три месяца после перехода в статус платящего клиента.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            Реферальная программа для сотрудников
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Порекомендуй компании новых клиентов – получи бонус <Gift className="inline h-6 w-6 md:h-8 md:w-8" />
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Если у тебя есть знакомые, которым могут быть полезны продукты Selectel – расскажи им о нас.
            Если из этого получится сотрудничество, ты получишь вознаграждение.
          </p>
        </div>

        {/* Revenue Card */}
        <Card className="mb-8 md:mb-12 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              Сколько можно получить?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base md:text-lg leading-relaxed">
              Ты получишь <span className="font-bold text-primary text-xl">30% от всей выручки</span> компании по клиенту за первые 3 месяца его работы с нами. 
              Отсчет срока пойдет с момента, как клиент выйдет на полную мощность потребления услуг после переезда/начала проекта. 
              Выплата будет облагаться налогом НДФЛ.
            </p>
          </CardContent>
        </Card>

        {/* How it works */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Как это работает</h2>
          <div className="grid gap-4 md:gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground font-bold text-sm md:text-base">
                      {index + 1}
                    </span>
                    <span className="text-base md:text-xl">{step.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-11 md:pl-14">
                  <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why it matters */}
        <Card className="mb-8 md:mb-12 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
              Почему это важно
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base md:text-lg">
              Каждая рекомендация помогает компании расти, а значит, у нас появляются новые интересные проекты, клиенты и возможности.
            </p>
          </CardContent>
        </Card>

        {/* CTA Button */}
        <div className="mb-8 md:mb-12">
          <Card className="p-6 md:p-8 text-center">
            <p className="text-lg md:text-xl font-semibold mb-4">Хочу рекомендовать клиента:</p>
            <Button 
              size="lg" 
              className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Скрыть форму' : 'Заполнить форму рекомендации'}
            </Button>
          </Card>
        </div>

        {/* Referral Form */}
        {showForm && (
          <div className="mb-8 md:mb-12">
            <ReferralForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs md:text-sm text-muted-foreground italic text-center mb-8 md:mb-12">
          *Программа не распространяется на сотрудников Департамента развития бизнеса, в чьи обязанности входит привлечение клиентов.
        </p>

        <Separator className="my-8 md:my-12" />

        {/* My Recommendations */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-2">
            <Users className="h-6 w-6 md:h-8 md:w-8" />
            Мои рекомендации
          </h2>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Дата</TableHead>
                      <TableHead className="min-w-[200px]">Рекомендация</TableHead>
                      <TableHead className="min-w-[180px] hidden md:table-cell">Инженер технического сопровождения продаж</TableHead>
                      <TableHead className="min-w-[120px]">Статус сделки в CRM</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          Загрузка...
                        </TableCell>
                      </TableRow>
                    ) : recommendations.length > 0 ? (
                      recommendations.map((rec, index) => (
                        <TableRow 
                          key={index}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => window.open(rec.crmUrl, '_blank', 'noopener,noreferrer')}
                        >
                          <TableCell className="font-medium">{rec.date}</TableCell>
                          <TableCell>{rec.company}</TableCell>
                          <TableCell className="hidden md:table-cell">{rec.engineer}</TableCell>
                          <TableCell>
                            <Badge variant={rec.statusVariant}>{rec.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          Вы еще не пригласили новых клиентов
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8 md:my-12" />

        {/* FAQ */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">FAQ</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base md:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};


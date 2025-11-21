import { useAuth } from 'react-oidc-context';
import { useEffect, useState, useRef } from 'react';
import { fetchUserDeals, type Deal } from '@/lib/api';
import { ReferralForm } from '@/components/ReferralForm';
import { logger } from '@/lib/logger';

// Bonus Block Component with Parallax Animation
const BonusBlock = () => {
  const blockRef = useRef<HTMLDivElement>(null);
  const svg1Ref = useRef<HTMLImageElement>(null);
  const svg2Ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!blockRef.current) return;

      const rect = blockRef.current.getBoundingClientRect();
      const isVisible = 
        rect.top < window.innerHeight && 
        rect.bottom > 0 &&
        rect.left < window.innerWidth && 
        rect.right > 0;

      if (!isVisible) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      // Parallax effect: reduced sensitivity (was 40, now 20)
      const offsetX = deltaX * 20;
      const offsetY = deltaY * 20;

      if (svg1Ref.current) {
        svg1Ref.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
      if (svg2Ref.current) {
        svg2Ref.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={blockRef}
      className="mb-6 sm:mb-8 md:mb-12 rounded-2xl relative overflow-visible xl:mx-auto max-w-[1159px] min-h-[250px] sm:h-[280px] md:h-[220px] w-full xl:w-[1159px]" 
      style={{
        background: 'linear-gradient(0turn, rgba(235,66,71,1) 0%, rgba(245,247,248,1) 33%)',
      }}
    >
      {/* SVG 1 - Top Left (symmetrically positioned) */}
      <img 
        ref={svg1Ref}
        src="/images/tild3761-6330-4730-a161-393131396139__group_2087325721.svg" 
        alt="" 
        className="absolute top-3 left-4 sm:top-5 sm:left-6 md:top-3 md:left-[20px] w-[40px] sm:w-[59px] md:w-[149px] h-auto z-0 transition-transform duration-75 ease-out"
        style={{ willChange: 'transform' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center h-full flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-4 sm:py-0">
        <h2 className="text-lg sm:text-[22px] md:text-[32px] font-medium text-[#092433] mb-2 md:mb-3 leading-[1.2]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
          <strong>Получи бонус!</strong>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#092433] opacity-80 max-w-full sm:max-w-[255px] md:max-w-[633px] leading-[1.3] px-2" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
          Если из лида вырастет реальный клиент, ты получишь вознаграждение. Выплата придет вместе с заработной платой через 3 месяца после выхода клиента на полную мощность потребления наших услуг.
        </p>
      </div>

      {/* SVG 2 - Bottom Right (symmetrically positioned) */}
      <img 
        ref={svg2Ref}
        src="/images/tild6231-3535-4563-a336-653561373438__group_1321317499.svg" 
        alt="" 
        className="absolute bottom-3 right-4 sm:top-[226px] sm:right-[502px] md:top-[116px] md:right-[20px] w-[24px] sm:w-[32px] md:w-[100px] h-auto z-0 transition-transform duration-75 ease-out"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

export const ReferralPage = () => {
  const auth = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const faqContentRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    return () => {
      isMounted = false;
    };
  }, [auth.isAuthenticated, auth.user]);

  const handleFormSuccess = () => {
    loadDeals();
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('referral-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('клиент') || lowerStatus.includes('client')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (lowerStatus.includes('отказ') || lowerStatus.includes('отклон') || lowerStatus.includes('reject')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (lowerStatus.includes('приостановлено') || lowerStatus.includes('pause') || lowerStatus.includes('hold')) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getCrmUrl = (deal: Deal): string => {
    const baseUrl = deal.isServercore 
      ? import.meta.env.VITE_SC_CRM 
      : import.meta.env.VITE_MAIN_CRM;
    return `${baseUrl}${deal.crmLeadId}`;
  };

  const recommendations = deals.map((deal) => ({
    date: formatDate(deal.date),
    company: deal.title,
    engineer: deal.manager,
    status: deal.status,
    statusBadgeClass: getStatusBadgeClass(deal.status),
    crmUrl: getCrmUrl(deal),
  }));

  const steps = [
    {
      title: 'Подумай, кому мы можем помочь.',
      description: 'Это может быть родственник, знакомый из другой компании или просто человек, которому будут полезны услуги Selectel.',
      icon: '/images/tild6164-3565-4636-a461-653939396136__1.svg',
    },
    {
      title: 'Расскажи им о нас.',
      description: 'Уточни есть ли темы для обсуждения, готовы ли они будут пообщаться поподробнее с коллегами.',
      icon: '/images/tild6535-3732-4535-b166-366565356134__2.svg',
    },
    {
      title: 'Заполни форму и расскажи все подробности.',
      description: 'Укажи контакты потенциального клиента, чтобы коллеги из Департамента по работе с клиентами могли выйти на связь и уточнить запрос.',
      icon: '/images/tild3962-3765-4337-b737-323738343731__3.svg',
    },
    {
      title: 'Дальше всё за нами.',
      description: 'Мы свяжемся, обсудим задачи, подготовим предложение. Актуальную информацию по статусу клиента ты сможешь уточнить на этом лендинге или напрямую у инженера технического сопровождения продаж, к которому перейдет твоя рекомендация.',
      icon: '/images/tild6332-6332-4366-b730-343464623463__4.svg',
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

  const toggleFaq = (index: number) => {
    const isCurrentlyOpen = openFaqIndex === index;
    setOpenFaqIndex(isCurrentlyOpen ? null : index);
    
    // Animate content
    const contentRef = faqContentRefs.current[index];
    if (contentRef) {
      if (isCurrentlyOpen) {
        // Closing: set current height, then animate to 0
        const currentHeight = contentRef.scrollHeight;
        contentRef.style.maxHeight = `${currentHeight}px`;
        // Force reflow
        void contentRef.offsetHeight;
        setTimeout(() => {
          contentRef.style.maxHeight = '0px';
        }, 10);
      } else {
        // Opening: set to 0, then animate to full height
        contentRef.style.maxHeight = '0px';
        contentRef.hidden = false;
        // Force reflow
        void contentRef.offsetHeight;
        setTimeout(() => {
          const fullHeight = contentRef.scrollHeight;
          contentRef.style.maxHeight = `${fullHeight}px`;
        }, 10);
      }
    }
  };


  // Refs for parallax SVG animations in hero section
  const heroBlockRef = useRef<HTMLDivElement>(null);
  const heroSvg1Ref = useRef<HTMLImageElement>(null); // tild3734-6230-4266-a666-656663346331__1.svg
  const heroSvg2Ref = useRef<HTMLImageElement>(null); // tild3437-3634-4338-a434-636436613035__group_1321317312.svg
  const heroSvg3Ref = useRef<HTMLImageElement>(null); // tild3635-6230-4661-b838-316537333964__photo.svg
  const heroSvg5Ref = useRef<HTMLImageElement>(null); // tild3534-6261-4937-b266-366363353063__svg-5.svg

  // Refs for parallax animation in "Почему это важно" block
  const whyBlockRef = useRef<HTMLDivElement>(null);
  const whyImageRef = useRef<HTMLImageElement>(null); // tild6433-6136-4636-a135-306261326135__photo.png

  // Parallax animation for hero section SVGs
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroBlockRef.current) return;

      const rect = heroBlockRef.current.getBoundingClientRect();
      const isVisible = 
        rect.top < window.innerHeight && 
        rect.bottom > 0 &&
        rect.left < window.innerWidth && 
        rect.right > 0;

      if (!isVisible) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      // Parallax effect: dx=10, dy=10 (as in original)
      const offsetX = deltaX * 10;
      const offsetY = deltaY * 10;

      if (heroSvg1Ref.current) {
        heroSvg1Ref.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
      if (heroSvg2Ref.current) {
        heroSvg2Ref.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
      if (heroSvg3Ref.current) {
        heroSvg3Ref.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for svg-5 bounce animation (starts when block is in viewport)
  useEffect(() => {
    if (!heroSvg5Ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class when element is visible
            if (heroSvg5Ref.current) {
              heroSvg5Ref.current.classList.add('animate-bounce-slow');
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(heroSvg5Ref.current);
    return () => observer.disconnect();
  }, []);

  // Parallax animation for "Почему это важно" block image
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!whyBlockRef.current) return;

      const rect = whyBlockRef.current.getBoundingClientRect();
      const isVisible = 
        rect.top < window.innerHeight && 
        rect.bottom > 0 &&
        rect.left < window.innerWidth && 
        rect.right > 0;

      if (!isVisible) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      // Parallax effect: dx=20, dy=20 (as in original)
      const offsetX = deltaX * 20;
      const offsetY = deltaY * 20;

      if (whyImageRef.current) {
        whyImageRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Tilda style */}
      <div className="px-4 xl:px-0">
        <div ref={heroBlockRef} className="relative bg-[#f5f7f8] rounded-[20px] md:rounded-[30px] xl:mx-auto max-w-[1159px] mt-5 mb-8 md:mb-12 w-full xl:w-[1159px] min-h-[400px] md:h-[514px]">
        {/* SVG слева - в оригинале: top:70px, left:calc(50% - 600px + 60px) относительно artboard
            Блок: top:20px, left:calc(50% - 600px + 20px)
            Относительно блока: top: 70-20=50px, left: 60-20=40px */}
        <img 
          src="/images/tild3231-3864-4266-b633-666439633536___.svg" 
          alt="" 
          className="absolute hidden md:block"
          style={{ top: '50px', left: '40px', width: '200px', height: '21px', objectFit: 'contain' }}
        />
        
        {/* SVG справа вверху - с parallax анимацией */}
        <img 
          ref={heroSvg1Ref}
          src="/images/tild3734-6230-4266-a666-656663346331__1.svg" 
          alt="" 
          className="absolute w-[133px] h-auto hidden md:block transition-transform duration-75 ease-out"
          style={{ top: '48px', right: '126px', willChange: 'transform' }}
        />
        
        {/* SVG слева внизу - с parallax анимацией */}
        <img 
          ref={heroSvg2Ref}
          src="/images/tild3437-3634-4338-a434-636436613035__group_1321317312.svg" 
          alt="" 
          className="absolute w-[50px] h-auto hidden md:block transition-transform duration-75 ease-out"
          style={{ top: '386px', left: '132px', willChange: 'transform' }}
        />
        
        {/* SVG справа вверху второй - с parallax анимацией */}
        <img 
          ref={heroSvg3Ref}
          src="/images/tild3635-6230-4661-b838-316537333964__photo.svg" 
          alt="" 
          className="absolute w-[116px] h-auto hidden md:block transition-transform duration-75 ease-out"
          style={{ top: '94px', right: '12px', willChange: 'transform' }}
        />
        
        <div className="relative z-10 text-center h-full flex flex-col items-center justify-start px-4 md:px-10 pt-4 md:pt-6 pb-6 md:pb-16">
          {/* Badges */}
          <div className="flex flex-col items-center gap-0 mb-4">
            <div className="bg-white rounded px-2 py-1 text-sm md:text-base text-[#092433] opacity-60 uppercase leading-[1.3]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
              Реферальная программа
            </div>
            <div className="bg-white rounded px-2 py-1 text-sm md:text-base text-[#092433] opacity-60 uppercase leading-[1.3]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
              для сотрудников
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-[#092433] mb-0 leading-tight max-w-full md:max-w-[705px] mx-auto px-2" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
            Порекомендуй компании новых клиентов –
          </h1>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-[#ff4a50] mb-3 leading-tight max-w-full md:max-w-[828px] mx-auto px-2" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
            получи бонус
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-[#092433] opacity-80 mb-4 max-w-full md:max-w-[629px] mx-auto px-2 leading-[1.3]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
            Если у тебя есть знакомые, которым могут быть полезны продукты Selectel – расскажи им о нас. Если из этого получится сотрудничество, ты получишь вознаграждение.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center relative">
            <button 
              id="cta-button"
              className="bg-[#092433] hover:bg-[#0f3c55] text-white text-sm sm:text-base md:text-xl px-6 sm:px-8 md:px-12 rounded-[10px] font-semibold cursor-pointer h-[50px] sm:h-[56px] md:h-[62px] transition-colors w-full sm:w-auto"
              onClick={scrollToForm}
            >
              Порекомендовать клиента
            </button>
            {/* SVG под кнопкой - центрирован по центру кнопки, с bounce анимацией при появлении в viewport */}
            <img 
              ref={heroSvg5Ref}
              src="/images/tild3534-6261-4937-b266-366363353063__svg-5.svg" 
              alt="" 
              className="w-[29px] h-[35px] pointer-events-none mt-2"
            />
          </div>
        </div>
      </div>
      </div>

      <div className="px-4 xl:px-0">
        <div className="container mx-auto max-w-[1159px]">
        {/* Revenue and Why Cards - Side by side */}
        <div ref={whyBlockRef} className="grid md:grid-cols-2 gap-2 md:gap-3 mb-8 md:mb-12 relative">
          {/* Сколько можно получить? - White card */}
          <div className="bg-white rounded-2xl border-0 p-4 sm:p-6 md:p-10 text-center shadow-[20px_0px_40px_10px_rgba(180,192,199,0.3)] min-h-[250px] sm:h-[280px] md:h-[300px] flex flex-col justify-center">
            <div className="p-0 mb-4 md:mb-6">
              <h3 className="text-[28px] md:text-[32px] font-medium text-[#092433] mb-3 md:mb-4" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                <span style={{ fontWeight: 600 }}>Сколько можно получить?</span>
              </h3>
            </div>
            <div className="p-0">
              <p className="text-sm md:text-base text-[#092433] opacity-80 leading-[1.3] mb-4" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                Ты получишь 30% от всей выручки компании по клиенту за первые 3 месяца его работы с нами.
              </p>
              {/* Tooltip */}
              <div className="relative inline-block group">
                <div className="w-[25px] h-[25px] cursor-pointer bg-[#d9dfe2] rounded-full flex items-center justify-center">
                  <svg role="presentation" width="100%" height="100%" style={{ display: 'block' }} viewBox="0 0 25 25">
                    <g stroke="none" strokeWidth="1.5" fill="none" fillRule="evenodd">
                      <g>
                        <path d="M13,10 L13,18" stroke="#092433" strokeLinejoin="bevel" />
                        <circle fill="#092433" cx="13" cy="7.0" r="1.3" />
                      </g>
                    </g>
                  </svg>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[250px] md:w-[301px] bg-white rounded-2xl p-3 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <p className="text-xs md:text-sm text-[#092433] leading-[1.4]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                    Отсчет срока пойдет с момента, как клиент выйдет на полную мощность потребления услуг после переезда/начала проекта. Выплата будет облагаться налогом НДФЛ.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Почему это важно - Dark card */}
          <div className="bg-[#092433] rounded-2xl border-0 p-4 sm:p-6 md:p-10 text-center relative shadow-[20px_0px_40px_10px_rgba(180,192,199,0.3)] min-h-[250px] sm:h-[280px] md:h-[300px] flex flex-col justify-center">
            <div className="p-0 mb-4 md:mb-6">
              <h3 className="text-[28px] md:text-[32px] font-medium text-white mb-3 md:mb-4" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                <span style={{ fontWeight: 600 }}>Почему это важно</span>
              </h3>
            </div>
            <div className="p-0">
              <p className="text-sm md:text-base text-white opacity-80 leading-[1.3]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                Каждая рекомендация помогает компании расти, а значит, у нас появляются новые интересные проекты, клиенты и возможности.
              </p>
            </div>
          </div>
          
          {/* Image - positioned absolutely relative to grid container, with parallax animation */}
          <img 
            ref={whyImageRef}
            src="/images/tild6433-6136-4636-a135-306261326135__photo.png" 
            alt="" 
            className="absolute top-[201px] left-[632px] w-[88px] h-[136px] hidden md:block pointer-events-none transition-transform duration-75 ease-out"
            style={{ 
              willChange: 'transform'
            }}
          />
        </div>

        {/* How it works */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-start mb-4 sm:mb-6 md:mb-8 gap-2 md:gap-3">
            <h2 className="text-xl sm:text-[28px] md:text-[32px] lg:text-[48px] font-medium text-[#092433] leading-[1.55]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
              <span style={{ fontWeight: 600 }}>Как это работает</span>
            </h2>
            <img 
              src="/images/tild3761-3633-4366-b262-396161373863__photo.svg" 
              alt="" 
              className="w-[24px] sm:w-[30px] md:w-[30px] lg:w-[51px] h-[20px] sm:h-[25px] md:h-[25px] lg:h-[43px] flex-shrink-0"
              style={{ transform: 'rotate(90deg)' }}
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-[7px]">
            {steps.map((step, index) => (
              <div key={index} className="bg-[#f5f7f8] rounded-2xl border-0 p-4 sm:p-6 md:p-10 flex flex-col" style={{ gap: '7px' }}>
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <h3 className="text-[21px] md:text-[22px] lg:text-[22px] font-medium text-[#092433] leading-[1.2]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-[14px] md:text-[16px] lg:text-[16px] text-[#092433] opacity-80 leading-[1.3]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                    {step.description}
                  </p>
                </div>
                {step.icon && (
                  <div className="mt-auto pt-4">
                    <img 
                      src={step.icon} 
                      alt="" 
                      className="w-10 h-10"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bonus CTA - Gradient style from Tilda */}
        <BonusBlock />
        </div>
      </div>

      {/* Referral Form - Full width background */}
      <div id="referral-form" className="mb-8 md:mb-12 scroll-mt-20 relative bg-[#e0e2e4] w-full py-6 sm:py-10 md:py-16">
        <div className="px-4 xl:px-0">
          <div className="container mx-auto max-w-[1159px]">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
            {/* Form Section */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-[48px] font-semibold text-[#092433] mb-4 sm:mb-6 md:mb-8 leading-[0.95]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                Рекомендовать клиента
              </h2>
              <ReferralForm 
                onSuccess={handleFormSuccess} 
                isLoading={isLoading}
              />
            </div>
            
            {/* Image Section */}
            <div className="hidden md:block relative -mt-10 md:-mt-16">
              <img 
                src="/images/tild3364-3664-4237-b633-313437653239__selectel_0254_1_1.jpg" 
                alt="Selectel" 
                className="w-full h-auto object-cover"
              />
              {/* Decorative SVG shapes */}
              <img 
                src="/images/tild6339-3064-4561-a137-656663313362__shape1.svg" 
                alt="" 
                className="absolute top-0 right-0 w-[122px] h-auto z-10"
              />
              <img 
                src="/images/tild3934-3264-4033-b562-393533353966__shape2.svg" 
                alt="" 
                className="absolute bottom-0 left-0 w-[122px] h-auto z-10"
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="px-4 xl:px-0">
        <div className="container mx-auto max-w-[1159px]">
        {/* Disclaimer */}
        <p className="text-xs md:text-sm text-[#092433] opacity-60 italic text-center mb-8 md:mb-12 leading-[1.3]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
          *Программа не распространяется на сотрудников Департамента развития бизнеса, в чьи обязанности входит привлечение клиентов.
        </p>

        <hr className="my-8 md:my-12 border-[#d9dfe2]" />

        {/* My Recommendations */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-[48px] font-semibold text-[#092433] mb-4 sm:mb-6 md:mb-8 leading-[0.95]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
            Мои рекомендации
          </h2>
          
          <div className="bg-white rounded-2xl border-0 shadow-sm">
            <div className="p-4 sm:p-6 md:p-10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#d9dfe2]">
                      <th className="min-w-[80px] sm:min-w-[100px] text-[#092433] font-semibold text-left p-2 sm:p-4 text-sm md:text-base">Дата</th>
                      <th className="min-w-[150px] sm:min-w-[200px] text-[#092433] font-semibold text-left p-2 sm:p-4 text-sm md:text-base">Рекомендация</th>
                      <th className="min-w-[150px] sm:min-w-[180px] hidden md:table-cell text-[#092433] font-semibold text-left p-2 sm:p-4 text-sm md:text-base">Инженер технического сопровождения продаж</th>
                      <th className="min-w-[100px] sm:min-w-[120px] text-[#092433] font-semibold text-left p-2 sm:p-4 text-sm md:text-base">Статус сделки в CRM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="text-center text-[#092433] opacity-60 py-8 p-4 text-sm md:text-base" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                          Загрузка...
                        </td>
                      </tr>
                    ) : recommendations.length > 0 ? (
                      recommendations.map((rec, index) => (
                        <tr 
                          key={index}
                          className="cursor-pointer hover:bg-[#f5f7f8] transition-colors border-b border-[#d9dfe2]"
                          onClick={() => window.open(rec.crmUrl, '_blank', 'noopener,noreferrer')}
                        >
                          <td className="font-normal text-[#092433] p-2 sm:p-4 text-sm md:text-base" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>{rec.date}</td>
                          <td className="text-[#092433] p-2 sm:p-4 text-sm md:text-base" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>{rec.company}</td>
                          <td className="hidden md:table-cell text-[#092433] opacity-80 p-2 sm:p-4 text-sm md:text-base" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>{rec.engineer}</td>
                          <td className="p-2 sm:p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs md:text-sm font-medium border ${rec.statusBadgeClass}`}>
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-[#092433] opacity-60 py-8 p-4 text-sm md:text-base" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                          Вы еще не пригласили новых клиентов
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 md:my-12 border-[#d9dfe2]" />

        {/* FAQ */}
        <div className="mb-8 md:mb-12">
          {/* FAQ Title */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-[48px] font-medium text-[#092433] leading-[0.95]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
              FAQ
            </h2>
          </div>

          {/* Spacer */}
          <div className="h-6 sm:h-8 md:h-10"></div>

          {/* FAQ Accordion */}
          <div className="max-w-[1159px] mx-auto">
            <div className="flex justify-center">
              <div className="w-full max-w-full sm:max-w-[90%] md:max-w-[66.666%]">
                {faqItems.map((item, index) => {
                  const isOpen = openFaqIndex === index;
                  
                  return (
                    <div key={index} className="t585__wrapper group">
                      <div className={`t585__header ${isOpen ? 't585__opened' : ''}`} style={{ borderTop: '1px solid #f1f1f1' }}>
                        <button
                          type="button"
                          onClick={() => toggleFaq(index)}
                          className="t585__trigger-button group w-full text-left flex items-center justify-between py-3 sm:py-4 cursor-pointer"
                          aria-controls={`accordion${index + 1}`}
                          aria-expanded={isOpen}
                        >
                          <span className="t585__title text-[20px] sm:text-[22px] md:text-[28px] font-medium text-[#092433] leading-[1.3] flex-1 pr-4" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                            {item.question}
                          </span>
                          <span className="t585__icon flex-shrink-0 relative ml-4" style={{ width: '40px', height: '40px' }}>
                            <span className="t585__lines absolute inset-0 flex items-center justify-center z-10 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', padding: '8px' }}>
                              <svg role="presentation" focusable="false" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g stroke="none" strokeWidth="1px" fill="none" fillRule="evenodd" strokeLinecap="square">
                                  <g transform="translate(1.000000, 1.000000)" stroke="#092433">
                                    <path d="M0,11 L22,11"></path>
                                    <path d="M11,0 L11,22"></path>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="t585__circle absolute inset-0 rounded-full transition-colors group-hover:bg-[#f1f1f1]" style={{ backgroundColor: isOpen ? '#f1f1f1' : 'transparent', width: '40px', height: '40px' }}></span>
                          </span>
                        </button>
                      </div>
                      <div
                        ref={(el) => { faqContentRefs.current[index] = el; }}
                        id={`accordion${index + 1}`}
                        className="t585__content overflow-hidden transition-all duration-300 ease-in-out"
                        style={{ maxHeight: '0px' }}
                        hidden={!isOpen}
                      >
                        <div className="t585__textwrapper">
                          <div className="t585__text text-sm sm:text-base md:text-[14px] lg:text-[18px] text-[#092433] font-normal leading-[1.4] pt-0 pb-3 sm:pb-4" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="t585__border" style={{ height: '1px', backgroundColor: '#f1f1f1' }}></div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white" style={{ minHeight: '75px' }}>
        <div className="px-4 xl:px-0">
          <div className="container mx-auto max-w-[1159px] py-5 md:py-[20px]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 md:gap-0">
            <div className="flex flex-col gap-0">
              <div className="text-[#092433] text-xs font-normal leading-[1.55]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                © АО «Селектел», 2008–2025
              </div>
              <div className="text-[#000000] text-base sm:text-lg md:text-xl font-normal leading-[1.55]" style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
                8 800 555-06-75
              </div>
            </div>
            <div className="md:ml-auto">
              <a href="https://selectel.ru" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/images/tild3462-3266-4165-b962-336239363235__a.svg" 
                  alt="Selectel" 
                  className="h-[28px] w-auto"
                />
              </a>
            </div>
          </div>
        </div>
        </div>
      </footer>
    </div>
  );
};

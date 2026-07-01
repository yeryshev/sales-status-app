import { logger } from './logger';

export interface Deal {
  date: number;
  title: string;
  manager: string;
  status: string;
  isServercore: boolean;
  crmLeadId: string;
  employeeName?: string;
}

export const fetchUserDeals = async (userId: string): Promise<Deal[]> => {
  try {
    const url = `${import.meta.env.VITE_GET_DEALS}?user=${userId}`;
    logger.log('Fetching deals from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    logger.log('Response status:', response.status);

    // Если код 200 и пустое тело - возвращаем пустой массив
    if (response.status === 200) {
      const text = await response.text();
      if (!text || text.trim() === '') {
        logger.log('Empty response body');
        return [];
      }
      return JSON.parse(text);
    }

    // Если код 304 - данные есть
    if (response.status === 304 || response.ok) {
      const data = await response.json();
      logger.log('Deals received:', data);
      return data;
    }

    logger.error('Unexpected response status:', response.status);
    return [];
  } catch (error) {
    logger.error('Error fetching deals:', error);
    return [];
  }
};

export const fetchAllDeals = async (): Promise<Deal[]> => {
  try {
    const url = import.meta.env.VITE_GET_DEALS;
    logger.log('Fetching all deals from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    logger.log('Response status:', response.status);

    // Если код 200 и пустое тело - возвращаем пустой массив
    if (response.status === 200) {
      const text = await response.text();
      if (!text || text.trim() === '') {
        logger.log('Empty response body');
        return [];
      }
      return JSON.parse(text);
    }

    // Если код 304 - данные есть
    if (response.status === 304 || response.ok) {
      const data = await response.json();
      logger.log('All deals received:', data);
      return data;
    }

    logger.error('Unexpected response status:', response.status);
    return [];
  } catch (error) {
    logger.error('Error fetching all deals:', error);
    return [];
  }
};

export interface CreateReferralData {
  employee_inside_id: string;
  employee_name: string;
  is_servercore: boolean;
  client_name: string;
  client_phone?: string;
  client_email?: string;
  client_telegram?: string;
  description: string;
}

export interface CreateReferralResponse {
  id: number;
  inside_id: number;
  crm_lead_id: number;
  is_servercore: boolean;
}

export const createReferral = async (data: CreateReferralData): Promise<CreateReferralResponse | null> => {
  try {
    const url = import.meta.env.VITE_GET_DEALS;
    logger.log('Creating referral:', data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    logger.log('Response status:', response.status);

    if (response.status === 200) {
      const text = await response.text();
      
      // Если пустое тело - ошибка
      if (!text || text.trim() === '') {
        logger.error('Empty response body - creation failed');
        return null;
      }
      
      // Успешное создание
      const result = JSON.parse(text);
      logger.log('Referral created:', result);
      return result;
    }

    logger.error('Unexpected response status:', response.status);
    return null;
  } catch (error) {
    logger.error('Error creating referral:', error);
    return null;
  }
};


import { User } from '@/entities/User';

export interface TeamTableSchema {
  list: User[];
  loading: boolean;
  error: string | null;
}

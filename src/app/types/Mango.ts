export type MangoRedisData = Record<string, boolean>

export interface MangoWsData {
  type: 'mango' | 'tasks'
  data: Record<string, boolean>
}

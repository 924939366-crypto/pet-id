export type Sex = '公' | '母'
export interface Dog {
  id: string; name: string; breed: string; sex: Sex; birthday: string
  weight: number | null; photo: string; chip: string; notes: string
}
export type RecordType = 'vaccine' | 'deworm_in' | 'deworm_out'
export interface CareRecord {
  id: string; dogId: string; type: RecordType; date: string; product: string; nextDue: string
}
export const TYPE_LABEL: Record<RecordType, string> = { vaccine: '疫苗', deworm_in: '内驱', deworm_out: '外驱' }
export const DEFAULT_INTERVAL: Record<RecordType, number> = { vaccine: 365, deworm_in: 90, deworm_out: 30 }

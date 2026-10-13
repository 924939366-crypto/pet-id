import { reactive, watch } from 'vue'
import type { Dog, CareRecord, RecordType } from './types'

const KEY = 'pet-id-data-v1'
interface State { dogs: Dog[]; records: CareRecord[] }
const saved = localStorage.getItem(KEY)
export const state = reactive<State>(saved ? JSON.parse(saved) : { dogs: [], records: [] })
watch(state, (s) => localStorage.setItem(KEY, JSON.stringify(s)), { deep: true })

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const today = () => fmt(new Date())
export function addDays(date: string, days: number) {
  const d = new Date(date + 'T00:00:00'); d.setDate(d.getDate() + days); return fmt(d)
}
export function daysUntil(date: string) {
  return Math.round((new Date(date + 'T00:00:00').getTime() - new Date(today() + 'T00:00:00').getTime()) / 86400000)
}
export const getDog = (id: string) => state.dogs.find((d) => d.id === id)
export function saveDog(dog: Dog) {
  const i = state.dogs.findIndex((d) => d.id === dog.id)
  i >= 0 ? (state.dogs[i] = dog) : state.dogs.push(dog)
}
export function removeDog(id: string) {
  state.dogs = state.dogs.filter((d) => d.id !== id)
  state.records = state.records.filter((r) => r.dogId !== id)
}
export const addRecord = (r: CareRecord) => state.records.push(r)
export const removeRecord = (id: string) => (state.records = state.records.filter((r) => r.id !== id))

/** 每只狗每种类型只取最新一条记录作为提醒 */
export function reminders() {
  const latest = new Map<string, CareRecord>()
  for (const r of state.records) {
    const k = r.dogId + r.type
    const cur = latest.get(k)
    if (!cur || r.date > cur.date) latest.set(k, r)
  }
  return [...latest.values()]
    .filter((r) => getDog(r.dogId) && r.nextDue)
    .map((r) => ({ ...r, dog: getDog(r.dogId)!, days: daysUntil(r.nextDue) }))
    .sort((a, b) => a.days - b.days)
}
export type Reminder = ReturnType<typeof reminders>[number]
export const ageText = (b: string) => {
  if (!b) return '-'
  const m = Math.floor(-daysUntil(b) / 30.44)
  return m < 12 ? `${m}个月` : `${Math.floor(m / 12)}岁${m % 12 ? (m % 12) + '个月' : ''}`
}
export type { RecordType }

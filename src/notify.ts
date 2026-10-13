import { reminders } from './store'
import { TYPE_LABEL } from './types'

/** 打开 App 时检查 7 天内到期/已过期项，弹浏览器通知（被拒绝或不支持则静默跳过） */
export async function notifyDue() {
  if (!('Notification' in window)) return
  const due = reminders().filter((r) => r.days <= 7)
  if (!due.length) return
  let perm = Notification.permission
  if (perm === 'default') perm = await Notification.requestPermission().catch(() => 'denied' as const)
  if (perm !== 'granted') return
  const body = due.slice(0, 5).map((r) =>
    `${r.dog.name} ${TYPE_LABEL[r.type]}：${r.days < 0 ? `已过期${-r.days}天` : r.days === 0 ? '今天到期' : `${r.days}天后到期`}`).join('\n')
  try { new Notification('狗狗证件提醒', { body }) } catch { /* 部分移动浏览器只允许 SW 通知 */ }
}

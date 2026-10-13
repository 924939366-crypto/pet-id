<script setup lang="ts">
import { computed } from 'vue'
import { state, reminders, ageText } from '../store'
import { TYPE_LABEL } from '../types'
const list = computed(() => reminders())
const level = (d: number) => (d < 0 ? 'overdue' : d <= 7 ? 'soon' : 'ok')
const dueText = (d: number) => (d < 0 ? `已过期 ${-d} 天` : d === 0 ? '今天到期' : `${d} 天后`)
</script>
<template>
  <div class="header"><h1>🐶 狗狗证件</h1><router-link to="/dog/new">+ 添加狗狗</router-link></div>
  <div class="section">
    <h2>待办提醒</h2>
    <div v-if="!list.length" class="empty">暂无提醒，给狗狗添加疫苗或驱虫记录吧</div>
    <router-link v-for="r in list" :key="r.id" :to="`/dog/${r.dogId}`" style="text-decoration:none;color:inherit">
      <div class="card row" :class="level(r.days)">
        <div style="flex:1">
          <div><b>{{ r.dog.name }}</b> · {{ TYPE_LABEL[r.type] }}</div>
          <div class="muted">到期日 {{ r.nextDue }}{{ r.product ? ' · 上次 ' + r.product : '' }}</div>
        </div>
        <span class="tag" :class="level(r.days)">{{ dueText(r.days) }}</span>
      </div>
    </router-link>
  </div>
  <div class="section">
    <h2>我的狗狗</h2>
    <div v-if="!state.dogs.length" class="empty">还没有狗狗档案<br /><br /><router-link class="btn" to="/dog/new">添加第一只狗狗</router-link></div>
    <router-link v-for="d in state.dogs" :key="d.id" :to="`/dog/${d.id}`" style="text-decoration:none;color:inherit">
      <div class="card row">
        <img v-if="d.photo" :src="d.photo" class="avatar" /><div v-else class="avatar">🐕</div>
        <div style="flex:1"><b>{{ d.name }}</b><div class="muted">{{ d.breed || '未知品种' }} · {{ d.sex }} · {{ ageText(d.birthday) }}</div></div>
        <span class="muted">›</span>
      </div>
    </router-link>
  </div>
</template>

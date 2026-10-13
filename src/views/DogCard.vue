<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { state, getDog, removeDog, removeRecord, ageText, daysUntil } from '../store'
import { TYPE_LABEL } from '../types'
const route = useRoute(), router = useRouter()
const id = route.params.id as string
const dog = computed(() => getDog(id))
const records = computed(() => state.records.filter((r) => r.dogId === id).sort((a, b) => b.date.localeCompare(a.date)))
function del() { if (confirm(`确定删除 ${dog.value?.name} 的档案和全部记录？`)) { removeDog(id); router.replace('/') } }
const level = (d: string) => { const n = daysUntil(d); return n < 0 ? 'overdue' : n <= 7 ? 'soon' : 'ok' }
</script>
<template>
  <div class="header"><button @click="router.push('/')">‹ 首页</button><h1>狗狗证件</h1><router-link :to="`/dog/${id}/edit`">编辑</router-link></div>
  <div v-if="!dog" class="empty">档案不存在</div>
  <template v-else>
    <div class="section">
      <div class="idcard">
        <div class="idcard-title">犬 只 身 份 证<small>DOG IDENTITY CARD</small></div>
        <div class="idcard-body">
          <div class="fields">
            <div><span>姓名</span>{{ dog.name }}</div>
            <div><span>品种</span>{{ dog.breed || '-' }}</div>
            <div><span>性别</span>{{ dog.sex }}　<span>年龄</span>{{ ageText(dog.birthday) }}</div>
            <div><span>生日</span>{{ dog.birthday || '-' }}</div>
            <div><span>体重</span>{{ dog.weight ? dog.weight + ' kg' : '-' }}</div>
          </div>
          <img v-if="dog.photo" :src="dog.photo" class="photo" /><div v-else class="photo">🐕</div>
        </div>
        <div class="chip"><span>芯片号</span>{{ dog.chip || '未登记' }}</div>
      </div>
      <div v-if="dog.notes" class="card" style="margin-top:10px"><span class="muted">备注：</span>{{ dog.notes }}</div>
    </div>
    <div class="section">
      <div class="row" style="justify-content:space-between;margin-bottom:10px"><h2 style="margin:0">疫苗 / 驱虫记录</h2>
        <router-link :to="`/dog/${id}/record`" class="tag ok" style="text-decoration:none;font-size:14px">+ 添加记录</router-link></div>
      <div v-if="!records.length" class="empty">暂无记录</div>
      <div v-for="r in records" :key="r.id" class="card row">
        <span class="tag">{{ TYPE_LABEL[r.type] }}</span>
        <div style="flex:1"><div>{{ r.product || '未填写产品' }}</div><div class="muted">{{ r.date }} 接种/使用</div></div>
        <div style="text-align:right"><span class="tag" :class="level(r.nextDue)">下次 {{ r.nextDue }}</span><br />
          <button class="muted" style="border:none;background:none;margin-top:4px" @click="removeRecord(r.id)">删除</button></div>
      </div>
    </div>
    <div class="section"><button class="btn danger" @click="del">删除档案</button></div>
  </template>
</template>
<style scoped>
.idcard{border-radius:16px;padding:16px;color:#4a3216;background:linear-gradient(135deg,#ffe8cc,#ffd8a8 60%,#ffc078);box-shadow:0 6px 18px rgba(255,138,61,.3);position:relative;overflow:hidden}
.idcard::after{content:'🐾';position:absolute;right:-10px;bottom:-20px;font-size:110px;opacity:.12}
.idcard-title{font-weight:bold;font-size:17px;letter-spacing:2px;border-bottom:1px dashed rgba(74,50,22,.3);padding-bottom:8px;margin-bottom:12px}
.idcard-title small{display:block;font-size:10px;letter-spacing:1px;opacity:.6;font-weight:normal}
.idcard-body{display:flex;gap:12px}.fields{flex:1;font-size:15px;line-height:2}
.fields span,.chip span{color:#a0703a;font-size:12px;margin-right:8px}
.photo{width:100px;height:125px;border-radius:8px;object-fit:cover;background:#fff4e6;display:flex;align-items:center;justify-content:center;font-size:48px;border:2px solid #fff}
.chip{margin-top:12px;font-family:monospace;font-size:16px;letter-spacing:1px}
</style>

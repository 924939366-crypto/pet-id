<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDog, addRecord, addDays, today, uid } from '../store'
import { TYPE_LABEL, DEFAULT_INTERVAL, type RecordType } from '../types'
const route = useRoute(), router = useRouter()
const dogId = route.params.id as string
const dog = getDog(dogId)
const types = Object.keys(TYPE_LABEL) as RecordType[]
const form = reactive({ type: 'vaccine' as RecordType, date: today(), product: '', interval: DEFAULT_INTERVAL.vaccine, nextDue: '' })
// 类型/日期/间隔变化时自动推算下次日期，用户仍可手动改 nextDue
watch(() => form.type, (t) => (form.interval = DEFAULT_INTERVAL[t]))
watch(() => [form.date, form.interval], () => { if (form.date && form.interval > 0) form.nextDue = addDays(form.date, form.interval) }, { immediate: true })
function submit() {
  addRecord({ id: uid(), dogId, type: form.type, date: form.date, product: form.product.trim(), nextDue: form.nextDue })
  router.replace(`/dog/${dogId}`)
}
</script>
<template>
  <div class="header"><button @click="router.back()">‹ 返回</button><h1>添加记录 · {{ dog?.name }}</h1><span style="width:40px" /></div>
  <form class="section form" @submit.prevent="submit">
    <label>类型<div class="seg"><button type="button" v-for="t in types" :key="t" :class="{ on: form.type === t }" @click="form.type = t">{{ TYPE_LABEL[t] }}</button></div></label>
    <label>日期<input type="date" v-model="form.date" required /></label>
    <label>产品 / 疫苗名称<input v-model="form.product" :placeholder="form.type === 'vaccine' ? '例如：卫佳8、狂犬' : '例如：拜宠清、福来恩'" /></label>
    <label>间隔天数（默认 {{ DEFAULT_INTERVAL[form.type] }} 天）<input type="number" min="1" v-model.number="form.interval" /></label>
    <label>下次到期日<input type="date" v-model="form.nextDue" required /></label>
    <button class="btn" type="submit">保存记录</button>
  </form>
</template>

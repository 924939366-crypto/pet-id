<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDog, saveDog, uid } from '../store'
import type { Dog } from '../types'
const route = useRoute(), router = useRouter()
const editing = getDog(route.params.id as string)
const form = reactive<Dog>(editing ? { ...editing } : { id: uid(), name: '', breed: '', sex: '公', birthday: '', weight: null, photo: '', chip: '', notes: '' })

/** 压缩到 400px 以内再存 dataURL，避免撑爆 localStorage */
function onPhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const img = new Image()
  img.onload = () => {
    const s = Math.min(1, 400 / Math.max(img.width, img.height))
    const c = document.createElement('canvas')
    c.width = img.width * s; c.height = img.height * s
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
    form.photo = c.toDataURL('image/jpeg', 0.8)
    URL.revokeObjectURL(img.src)
  }
  img.src = URL.createObjectURL(file)
}
function submit() {
  if (!form.name.trim()) return alert('请填写名字')
  saveDog({ ...form })
  router.replace(`/dog/${form.id}`)
}
</script>
<template>
  <div class="header"><button @click="router.back()">‹ 返回</button><h1>{{ editing ? '编辑档案' : '添加狗狗' }}</h1><span style="width:40px" /></div>
  <form class="section form" @submit.prevent="submit">
    <label style="text-align:center">
      <img v-if="form.photo" :src="form.photo" class="avatar" style="width:90px;height:90px;margin:0 auto" />
      <div v-else class="avatar" style="width:90px;height:90px;margin:0 auto;font-size:40px">📷</div>
      <span class="muted">点击上传照片</span>
      <input type="file" accept="image/*" style="display:none" @change="onPhoto" />
    </label>
    <label>名字 *<input v-model="form.name" placeholder="例如：旺财" /></label>
    <label>品种<input v-model="form.breed" placeholder="例如：柯基" /></label>
    <label>性别<div class="seg"><button type="button" v-for="s in ['公','母'] as const" :key="s" :class="{ on: form.sex === s }" @click="form.sex = s">{{ s }}</button></div></label>
    <label>生日<input type="date" v-model="form.birthday" /></label>
    <label>体重 (kg)<input type="number" step="0.1" v-model.number="form.weight" /></label>
    <label>芯片号<input v-model="form.chip" placeholder="15 位芯片号" /></label>
    <label>备注<textarea v-model="form.notes" rows="3" placeholder="过敏、性格等" /></label>
    <button class="btn" type="submit">保存</button>
  </form>
</template>

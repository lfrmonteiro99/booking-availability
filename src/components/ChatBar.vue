<template>
    <div>
      <div v-for="msg in messages" :key="msg.id" :class="msg.from">{{ msg.text }}</div>
      <form @submit.prevent="send">
        <input v-model="input" placeholder="Ask a question..." />
      </form>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
  import { ref } from 'vue'
  
  const input = ref('')
  const messages = ref([])
  
  async function send() {
    if (!input.value.trim()) return
    messages.value.push({ id: Date.now(), from: 'user', text: input.value })
    const res = await axios.post('/api/dialogflow/detect', { message: input.value })
    messages.value.push({ id: Date.now()+1, from: 'bot', text: res.data.reply })
    input.value = ''
  }
  </script>
  
  <style>
  .user { text-align: right; }
  .bot { text-align: left; }
  </style>
  
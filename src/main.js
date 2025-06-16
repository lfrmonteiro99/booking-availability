import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'

const API_TOKEN = 'L5V9R0P2S4T6U8W0X2Y4Z6A8B0C2D4E6F8G0H1J3K5';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Authorization'] = `Bearer ${API_TOKEN}`;

createApp(App).mount('#app')

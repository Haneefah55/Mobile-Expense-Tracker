import axios from 'axios'
import { EXPO_PUBLIC_API_URL } from '@env'

const apiUrl = process.env.EXPO_PUBLIC_API_URL

const axiosInstance = axios.create({
  baseURL: "https://wallet-mobile.onrender.com/api", 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 120000,
})


export default axiosInstance
import axios from 'axios'
import { EXPO_PUBLIC_API_URL } from '@env'

const apiUrl = process.env.EXPO_PUBLIC_API_URL

const axiosInstance = axios.create({
  baseURL: apiUrl,    //http://10.45.55.215:5000/api',   //process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 120000,
})

export default axiosInstance
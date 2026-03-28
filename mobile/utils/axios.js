import axios from 'axios'
import { EXPO_PUBLIC_API_URL } from '@env'

const apiUrl = process.env.EXPO_PUBLIC_API_URL

const axiosInstance = axios.create({
  baseURL: "http://10.45.55.215:5000/api",    //http://10.45.55.215:5000/api', //apiUrl
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 120000,
})


export default axiosInstance
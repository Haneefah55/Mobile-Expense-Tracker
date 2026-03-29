import { create } from 'zustand'
import axios from '../utils/axios.js'
import Toast from 'react-native-toast-message'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'


export const useAuthStore = create((set, get) =>({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  error: null,
  setUser: (user) => set({ user }),

  login: async(email, password) =>{
    set({ isLoading: true, error: null })
    try {
      const res = await axios.post('/auth/login', { email, password })
      console.log(res.data)
      set({ isLoading: false, user: res.data.user, isAuthenticated: true })
    
    } catch (error) {
      console.log(error.response?.data?.message,)
      set({ error: error.response?.data?.message, isLoading: false, user: null, isAuthenticated: false })
      throw error
      
    }
  },

  signup: async(name, email, password)=>{
    set({ isLoading: true, error: null })

    try {
      const res = await axios.post('/auth/signup', { name, email, password })
      console.log("res.data", res.data)
      set({ isLoading: false })
    } catch (error) {
      console.log("error in store", error.response?.data?.message)
      set({ error: error.response?.data?.message, isLoading: false })
      throw error
    }
  },

  checkAuth: async() =>{
    
    try {
      const res = await axios.get('/auth/')

      set({
        user: res.data,
        isLoading: false,
        isAuthenticated: true
      })

    } catch (error) {
      console.log("check auth error", error.response?.data?.message,)
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  },

  logout: async() =>{
    try {
      const res = await axios.post('/auth/logout')
      

      set({ user: null, isAuthenticated: false })
      router.replace('/(auth)/login')
      Toast.show({
        text1: "Session Expired",
        text2: "Please login to continue"
      })
      console.log("user logout")
    } catch (error) {
      
      //set({ user: null, error: error.message, isAuthenticated: false })
      console.log("err logingg out", error)
      
    }
  },

  verifyAuthCode: async(code) =>{
    try {
      const res = await axios.post('/auth/verify-auth-code', { code })
      console.log("verify auth res", res.data)
      set({ user: res.data, isAuthenticated: true })
    } catch (error) {
      console.log(error)
      set({ user: null, isAuthenticated: false })
    }
  },

  verifyAccount: async() =>{

    set({ isLoading: true, error: null })

    try {

      const res = await axios.get('/auth/verify')

      console.log(res.data)

      set({ isLoading: false, error: null })


      
    } catch (error) {
      console.log(error.response?.data?.message,)
      set({ error: error.response?.data?.message, isLoading: false })
      throw error
    }
  },

  verifyCode: async(code) =>{

    set({ isLoading: true, error: null })

    try {

      const res = await axios.post('/auth/verify-code', { code })

      console.log(res.data)

      set({ user: res.data, isLoading: false, error: null })
      
    } catch (error) {
      console.log("erreo", error.response?.data?.message,)
      set({ error: error.response?.data?.message, isLoading: false })
      throw error
    }
  },

  resendCode: async() =>{

    set({ error: null })
    try {

      const res = await axios.get('/auth/resend-code')

      console.log(res.data)

      set({ error: null })
      
    } catch (error) {
      console.log(error.response?.data?.message,)
      set({ error: error.response?.data?.message || "internal server error" })
      throw error
    }

  }


  
}))


// Axios interceptore to check session expires

/* axios.interceptors.response.use((response) => response, async(error) =>{

  if(error.response?.status === 401){
    useAuthStore.getState().logout()
  }

  return Promise.reject(error)

} 
) */
import { create } from 'zustand'
import axios from '../utils/axios.js'

export const useBudgetStore = create((set, get) =>({

  budget: 0,
  balance: 0,
  spent: 0,
  percent: 0,
  categoryData: [],
  loading: false,
  error: null,
  allBudget:[],

  fetchAllBudget: async() =>{
    set({ loading: true, error: null })

    try {
      const res = await axios.get('/budget')
      set({ loading: false, allBudget: res.data })
      
    } catch (error) {
      console.log(error.message)
      console.log("fetch budget err", error.message)
      set({ loading: false, error: error.response?.data?.message })
      throw error
    }
  },


  fetchMontlyOverall: async(startDate) =>{

    try {

      const res = await axios.post('/budget/overall', { startDate })

      set({ 
        budget: res.data.totalBudget,
        balance: res.data.totalRemaining,
        spent: res.data.totalSpent,
        percent: res.data.percentSpent,
        categoryData: res.data.categoryResult,
      })
      
    } catch (error) {
      console.log(error)
    }

  },

  addBudget: async(title, period, limit_amount, startDate, category) =>{

    set({ loading: true, error: null })

    try {
      const res = await axios.post('/budget', { title, period, limit_amount, startDate, category })
      console.log("add budget res", res.data)

      set((prev) =>({
        allBudget: [...prev.allBudget, res.data],
        loading: false,
      }))

      

      get().fetchMontlyOverall()
      get().fetchAllBudget()

    } catch (error) {
      console.log("add budget err", error.message)
      set({ loading: false, error: error.response?.data?.message })
      throw error
    }
  }, 

  

  








}))
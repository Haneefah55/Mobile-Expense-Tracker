import { create } from 'zustand'
import axios from '../utils/axios.js'

export const useTransactionStore = create((set, get) =>({

  transactions: [],
  balance: 0,
  income: 0,
  expenses: 0,
  expenseSummary: [],
  loading: false,
  error: null,
  setTransactions: (transactions) => set({ transactions }),

  fetchAllTransactions: async() =>{
    set({ loading: true })

    try {
      const res = await axios.get('/transaction')
      set({ loading: false, transactions: res.data })
      
    } catch (error) {
      console.log("fetch all trans", error.message)
    }
  },

  fetchSummary: async() =>{
    
    try {
      const res = await axios.get('/transaction/summary')
      //console.log("sum", res.data)
      set({ 
        balance: res.data.summary.balance,
        income: res.data.summary.totalIncome,
        expenses: res.data.summary.totalExpenses,
        expenseSummary: res.data.expenseSummary
      })
    } catch (error) {
      console.log("summry", error)
    }
  },

  addTransaction: async(type, title, amount, category, date) =>{

    set({ loading: true, error: null })

    try {
      const res = await axios.post('/transaction', { type, title, amount, category, date })
      //console.log("add res", res.data)
      set((prev) =>({
        transactions: [...prev.transactions, res.data],
        loading: false,
      }))

      

      get().fetchSummary()
      get().fetchAllTransactions()

    } catch (error) {
      console.log("add transaction err", error.message)
      set({ loading: false, error: error.response?.data?.message })
      throw error
    }
  },

  editTransaction: async (title, amount, category, date, id) => {

    set({ loading: true, error: null })

    try {
      const res = await axios.patch(`/transaction/${id}`, { title, amount, category, date })
      console.log("edit res", res.data)

      set({ loading: false })

      

      get().fetchSummary()
      get().fetchAllTransactions()

    } catch (error) {
      console.log("edit transaction err", error.message)
      set({ loading: false, error: error.response?.data?.message })
      throw error
    }
  },

  deleteTransaction: async (id) => {

    set({ loading: true, error: null })

    try {
      const res = await axios.delete(`/transaction/${id}`)
      //console.log("add res", res.data)

      set((prev) =>({
      transactions: prev.transactions.filter((transaction) => transaction._id !== id),
      
      }))

      

      get().fetchSummary()
      get().fetchAllTransactions()

    } catch (error) {
      console.log("delete transaction err", error.message)
      set({ loading: false, error: error.response?.data?.message })
      throw error
    }
  }

  

  

  








}))
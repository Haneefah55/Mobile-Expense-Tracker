import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore.js'
import { Ionicons } from '@expo/vector-icons'
import ExpenseChart from '../../components/ExpenseChart.jsx'
import axios from '../../utils/axios.js'
import { getPreviousWeeks } from '../../utils/getWeeks.js'

import { useTransactionStore } from '../../store/transactionStore.js'
import { useRouter } from 'expo-router'


const HomeScreen = () => {
  const { user } = useAuthStore()
  console.log("ome", user)

  const [isDrop, setIsDrop] = useState(false)
  
 const router = useRouter()

  const currentHour = new Date().getHours()

  let greetings = ""

  const [data, setData] = useState([])

  const result = getPreviousWeeks()

  //console.log("result", result)
   const [startDate, setStartDate] = useState(result[0].start)
   const [label, setLabel] = useState(result[0].label || result[0].dateRange)
  //console.log("startdate", startDate)


  if (currentHour < 12){
    greetings = "Good Morning"
  } else if(currentHour < 18){
    greetings = "Good Afternoon"
  } else{
    greetings = "Good Evening"
  }

 
  //const category = ["transport", "grocery", "bill", "health", "house", "shopping", "others", "income"]
  const fontCat = [
    {id: "salary", name: "bus" },
    {id: "freelance", name: "construct" },
    {id: "business", name: "business" },
    {id: "investments", name: "pulse" },
    {id: "gift", name: "gift" },
    {id: "rentals", name: "home" },
    {id: "others", name: "cash-outline" },
    {id: "transport", name: "bus" },
    {id: "food", name: "fast-food" },
    {id: "utilities", name: "desktop" },
    {id: "health", name: "fitness" },
    {id: "housing", name: "home" },
    {id: "shopping", name: "cart" },
    {id: "entertainment", name: "game-controller" },
  ]

  const handleSelect = (item) =>{

    setLabel(item.label || item.dateRange)
    setStartDate(item.start)
    setIsDrop(!isDrop)
    

  }

  const { balance, income, expenses, transactions, fetchAllTransactions, fetchSummary } = useTransactionStore()

  //console.log(balance, income, expenses)
  useEffect(() =>{

    const fetchWeeklyExpense = async() =>{
      const res = await axios.post('/transaction/week-expense', { startDate })

      setData(res.data)


    }

    fetchWeeklyExpense()

  }, [startDate, expenses])

  useEffect(() => {

    fetchAllTransactions()
  }, [fetchAllTransactions])


  useEffect(() => {

    fetchSummary()
  }, [fetchSummary])

  return (

    
    <View className=" bg-gray-50 px-4 py-4 flex-1 flex-col"> 
      
      <View className="flex  flex-row items-center justify-between my-3">
        <View className=" flex flex-row px-3 items-center">
          {user?.image ? (<Image source={{ uri: user?.image }} className="w-[50px] h-[50px] object-contain rounded-full mr-3"/>) 
          
          : (<View className="w-[50px] h-[50px] mr-3 object-contain rounded-full flex bg-fuchsia-900 items-center justify-center">
            <Text className="text-white text-3xl font-outfit-semibold">{user?.name?.charAt(0)}</Text>
          </View>)
          }

          <View className="flex flex-col ">
            <Text className="text-xl font-outfit">{greetings}</Text>
            <Text className="text-2xl font-outfit-medium ">{user?.name}</Text>

          </View>

        </View>

        <TouchableOpacity className="mr-2">
          <Ionicons name='notifications-circle' size={30} color={'#4a044e'} />
        </TouchableOpacity>

      </View>

      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
        
      
      >
        <View className="bg-fuchsia-900 w-full h-[180px] rounded-xl shadow-md p-4">
        <Text className="text-white text-xl mb-3 font-outfit-medium">
          Total Balance:
        </Text>

        <Text className="text-white text-3xl mb-3 font-outfit-medium">
          &#8358; {balance.toLocaleString()}
        </Text>

        <View className="flex flex-row items-center justify-between mt-3 px-2"> 
          <View className="flex flex-col gap-2 items-center justify-center">
            <View className="flex flex-row gap-2 items-center justify-center">
              
                
              <Ionicons name='trending-up' size={25} color={'#22c55e'}/>
              
              <Text className="text-green-600 text-lg font-outfit">Income</Text>
            </View>

            <Text className="text-green-600 text-xl mb-3 font-outfit-medium">&#8358; {income.toLocaleString()}</Text>
          </View>

          <View className="flex flex-col gap-2 items-center justify-center">
            <View className="flex flex-row gap-2 items-center justify-center">
            
                <Ionicons name='trending-down' size={25} color={'#ef4444'}/>
              
              <Text className="text-red-600 text-lg font-outfit">Expenses</Text>
            </View>

            <Text className="text-red-600 text-xl mb-3 font-outfit-medium">&#8358; {expenses.toLocaleString()}</Text>
          </View>

        </View>


        </View>

        <View className=" mt-4 bg-white w-full h-[350px] py-2 rounded-lg shadow-sm px-1 ">
          
          
          <View className="relative flex-row justify-between p-3 mb-2">
            <Text className="text-lg font-outfit-semibold ">Expense Summary</Text>
            

            <TouchableOpacity className="  flex flex-row gap-1 px-2 py-1 items-center justify-center border-2 border-fuchsia-800  rounded-lg" onPress={() => setIsDrop(!isDrop)}>
              <Text className="text-xl font-outfit-bold ">{label}</Text>
              <Ionicons name='chevron-up' className={`${isDrop ? "flex" : "hidden"}`}/>
              <Ionicons name='chevron-down' className={`${isDrop ? "hidden" : "flex"}`}/>
            </TouchableOpacity>

            <View className ={`${isDrop ? "flex" : "hidden"} absolute flex-col items-left justify-center p-2 top-14 shadow-md right-2 w-[150px] bg-white z-20 h-[150px]`}>

              {result.map((item) => (
                <TouchableOpacity key={item.start} onPress={() =>handleSelect(item)}>
                  <Text className="text-xl ml-3 mb-2  ">{item.label || item.dateRange}</Text>
                </TouchableOpacity>
              ))}



            </View>
            
    
          </View>
          <ExpenseChart expenseData={data}/>
        </View>

        <View 
          
          className="flex flex-col  bg-white p-3 rounded-lg shadow-lg mt-4 mb-5 gap-3">
            <View className="flex flex-row px-3 py-3 justify-between">
              <Text className="text-xl font-outfit-bold">Recent Transactions</Text>
              <TouchableOpacity onPress={() => router.replace('/(tabs)/transaction/allTransaction')} className="  bg-transparent">
              <Text className="font-outfit-bold text-lg">View All</Text>
            </TouchableOpacity>

            </View>
          

          { transactions.length === 0 &&
            <View className=" flex mt-5 items-center justify-center">
              <Text className="font-outfit-semibold text-xl">No Recent Transactions</Text>
            </View>
          }

          {
            transactions.length > 0 &&

            <View className="flex flex-col pb-5 gap-3">
              {transactions.slice(0, 5).map((item) => (
                <View key={item._id} className="bg-gray-100 mb-3 shadow-lg flex flex-row items-center px-3 py-2 rounded-lg justify-between">

                  <View className="flex flex-row gap-3 items-center">
                    <View className="bg-fuchsia-900 p-2 rounded-full">

                      <Font name={`${fontCat.find(cat => cat.id === item.category)?.name || ""}`} />
                      
                    </View>

                    <View className="flex flex-col">
                      <Text className="text-xl capitalize font-outfit-semibold">{item?.title}</Text>
                      <Text className="text-gray-500 text-sm  font-outfit capitalize">{item?.category}</Text>
                    </View>
                  </View>
                  
                  <View className="flex flex-col gap-1 justify-center" >
                    <View className="flex flex-row gap-3">
                      <Text className={` text-xl font-outfit-medium ${item?.type === "expense" ? "text-red-600" : "text-green-600"}`}>&#8358;  {item?.amount.toLocaleString()}</Text>
                    </View>

                    <Text className="font-outfit text-gray-500 text-sm">{item?.date?.split("T")[0]}</Text>
                    
                  </View>
                  
                  
                </View>
              ))}
            </View>
          }
          

          

        </View>

      </ScrollView>

      


    
    </View>
  
    
  )
}

export default HomeScreen

const Font = ({ name }) =>(
  <Ionicons name={name} size={15} color={'#fff'} />
)
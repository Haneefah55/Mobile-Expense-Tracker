import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTransactionStore } from '../../../store/transactionStore.js'
import { Ionicons, FontAwesome6 } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import { getMonths } from '../../../utils/getWeeks.js'

const Transaction = () => {
  const { fetchAllTransactions, transactions, deleteTransaction   } = useTransactionStore()

  const months = getMonths()
  const [showPrompt, setShowPrompt] = useState(false)
  const [showId, setShowId] = useState("")
  //console.log("months", months)

  const month = months.map((item) =>{
    const date = item.start.slice(0, 7)
  

    return {
      date: date,
      label: item.dateRange
    }
  })
  //console.log(transactions)
  //console.log(month)
  const [isDrop, setIsDrop] = useState(false)

  const [start, setStart] = useState(month[0].date)
  const [label, setLabel] = useState(month[0].label)
  //console.log("start", start)

 /*  const tra = transactions.map((tran) =>{
    console.log(tran.date.split("T")[0])
  }) */

  const handleSelect = (item) =>{

    setLabel(item.label)
    setStart(item.date)
    setIsDrop(!isDrop)
    console.log("item", item)
    //console.log("start", start)
    

  }

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

  const router = useRouter()

  

  const handleCancelDelete = () =>{
    setShowId("")
  }

  const handleDelete = async(id) =>{


    try {

      console.log(id)
      await deleteTransaction(id)
      Toast.show({
        text1: "Transaction deleted successfuly"
      })
    } catch (error) {
      Toast.show({
        text1: error.message
      })
      console.log(error)

    } finally {
      setShowId("")
    }
  }

  const showDeletePrompt =(id) =>{
    //setShowPrompt(true)
    setShowId(id)
    console.log(id)

  }

 
  
  useEffect(() =>{

    fetchAllTransactions()
  },[fetchAllTransactions])




  return (
    <View className="flex-1 flex-col mt-10 px-4">
      <View className=" relative mb-5">
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home") }>
          <Ionicons name='arrow-back' size={20} />
        </TouchableOpacity>

        <Text className="font-outfit-medium text-2xl text-center capitalize">Transaction History</Text>

      </View>
      <View className="flex w-[100px] ml-3 mb-3 relative">
        <TouchableOpacity className="flex flex-row gap-3 items-center justify-center border-2 border-fuchsia-900 p-2 rounded-lg" onPress={() => setIsDrop(!isDrop)}>
          <Text className="font-outfit-medium text-md" >{label}</Text>
          <Ionicons name='chevron-up' className={`${isDrop ? "flex" : "hidden"}`}/>
          <Ionicons name='chevron-down' className={`${isDrop ? "hidden" : "flex"}`}/>
        </TouchableOpacity>

        <View className ={`${isDrop ? "flex" : "hidden"} absolute flex-col items-left justify-center p-2 top-12 shadow-md left-2 w-[150px] bg-white z-20 h-[150px]`}>
      
          {month.map((item) => (
            <TouchableOpacity key={item.date} onPress={() =>handleSelect(item)}>
              <Text className="text-xl ml-3 mb-2  ">{item.label} {item.date}</Text>
            </TouchableOpacity>
          ))}



        </View>
      </View>

      

      
      { transactions.length === 0 &&
        <View className=" flex my-4 items-center justify-center">
          <Text className="font-outfit-semibold text-xl">No Recent Transactions</Text>
        </View>
      }


      {
        transactions.length > 0 &&
        <ScrollView
          
          vertical
          showsVerticalScrollIndicator={false}
          
          
        
        >
          <View className="flex flex-grow flex-col w-[100%] mt-2 px-3 gap-3 relative">
          {transactions.map((item) => (
            <View key={item._id} className={`bg-gray-100 px-3 py-2 rounded-lg mb-3 shadow-lg flex-row items-center justify-between ${item?.date?.slice(0, 7) === start ? "flex" : "hidden"}`}>

              <View className="flex flex-row gap-3 items-center">
                <View className="bg-fuchsia-900 p-2 rounded-full">

                  <Font name={`${fontCat.find(cat => cat.id === item.category)?.name || ""}`} />
                  
                </View>

                <View className="flex flex-col">
                  <Text className="text-xl capitalize w-[130px] font-outfit-semibold">{item?.title}</Text>
                  <Text className="text-gray-500 text-sm  font-outfit capitalize">{item?.category}</Text>
                </View>
              </View>
              
              <View className="flex flex-row gap-2 justify-center items-center" >
                <View className="flex flex-col gap-1">
                  <Text className={` text-xl font-outfit-medium ${item?.type === "expense" ? "text-red-600" : "text-green-600"}`}>&#8358;  {item?.amount.toLocaleString()}</Text>

                  <Text className="font-outfit text-gray-500 text-sm">{item?.date?.split("T")[0]}</Text>
                </View>

                <View className="flex flex-row gap-2">
                  <TouchableOpacity onPress={() => showDeletePrompt(item._id) }>
                    <FontAwesome6 name='trash-can' size={15} color={`${item?.type === "expense" ? "#dc2626" : "#16a34a"}`}/>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => router.push(`/(tabs)/transaction/edit-transaction/${item?._id}`)}>
                    <FontAwesome6 name='pencil' size={15} color={`${item?.type === "expense" ? "#dc2626" : "#16a34a"}`}/>
                  </TouchableOpacity>
                </View>

                  
            

              </View>

              
              
              
            </View>
          ))}

          

          {transactions.map((item) =>(

            <View key={item._id} className={`${showId === item._id ? "flex" : "hidden"} items-center justify-center absolute top-[50%] left-10  w-[280px] h-[150px] bg-gray-100 rounded-lg shadow-md p-41`}
              > 

              <Text className="text-xl font-outfit-medium text-center">Are you sure you want to delete the transaction</Text>

              <View className="flex items-center  mt-4 justify-center gap-3 flex-row">
                <TouchableOpacity className="p-3 bg-fuchsia-800 rounded-lg border-2 border-fuchsia-800 " onPress={() => handleDelete(item._id)}>
                  <Text className="font-outfit-semibold text-xl text-white">Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity className="p-3 border-2 rounded-lg border-fuchsia-800 " onPress={handleCancelDelete} >
                  <Text className="font-outfit-semibold text-xl text-fuchsia-800">Cancel</Text>
                </TouchableOpacity>

              </View>

            </View>
          ))}
          </View>

          
        </ScrollView>
        
      }


    </View>
  )
}

export default Transaction


const Font = ({ name }) =>(
  <Ionicons name={name} size={15} color={'#fff'} />
)
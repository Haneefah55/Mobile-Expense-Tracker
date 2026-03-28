import { View, Text, Platform, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import axiosInstance from '../../../../utils/axios'
import Toast from 'react-native-toast-message'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { useTransactionStore } from '../../../../store/transactionStore.js'

const editTransaction = () => {

  const { id } = useLocalSearchParams()

  const [data, setData] = useState([])

  const router = useRouter()

  const { editTransaction, loading } = useTransactionStore()

  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState("")

  console.log("data", data)
 // console.log(id)

  const expenseCat = [
    {id: "transport", name: "bus" },
    {id: "food", name: "fast-food" },
    {id: "utilities", name: "desktop" },
    {id: "health", name: "fitness" },
    {id: "housing", name: "home" },
    {id: "shopping", name: "cart" },
    {id: "others", name: "cash-outline" },
    {id: "entertainment", name: "game-controller" },
  ]

  const incomeCat = [
    {id: "salary", name: "bus" },
    {id: "freelance", name: "construct" },
    {id: "business", name: "business" },
    {id: "investments", name: "pulse" },
    {id: "gift", name: "gift" },
    {id: "rentals", name: "home" },
    {id: "others", name: "cash-outline" },
  ]

  const [showIOSPicker, setShowIOSPicker] = useState(false)
  const [date, setDate] = useState(new Date())

  console.log(data?.date)
  
  const openAndroidDatePicker =() =>{
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, seletedDate) =>{
        if(seletedDate){
          setDate(seletedDate)
        }
      },
      mode: 'date',
      minimumDate: new Date(1950, 0, 1),
      maximumDate: new Date(2050, 11, 31)
    })
  }
  
  const openIOSDatePIcker= () =>{
    setShowIOSPicker(true)
  }

  const handleIOSChange = (event, seletedDate) =>{
    setShowIOSPicker(false)
    if(seletedDate) {
      setDate(seletedDate)
    }
  }


  const handleDatePicker = () =>{
    if(Platform.OS === 'android'){
      openAndroidDatePicker()
    } else {
      openIOSDatePIcker()
    }
  }
  const handleEditTransaction = async()=>{
  
   
    if(!title || !amount || !category || !date){
      return Alert.alert("All fields are required")
    }

    const id = data._id

    console.log(id)
    console.log(title, amount, category, date)

    try {
      await editTransaction(title, amount, category, date, id)
      //Alert.alert("Transaction added successfuly")

      Toast.show({
        text1: "Transaction edited successfuly"
      })

      router.replace('/(tabs)/transaction/allTransaction')
    } catch (error) {
      Alert.alert("error", error.message || "something went wrong")
    } 
  }


  useEffect(() =>{

    if(data){
      setTitle(data.title)
      setAmount(String(data.amount))
      setCategory(data.category)
      
      const parseDate = new Date(data.date)

      if(!isNaN(parseDate.getTime())) {
        setDate(parseDate)
      }
    }

    
    
  },[data])


  useEffect(() =>{

    const fetchTransaction = async() =>{
      try {
        const res = await axiosInstance.get(`/transaction/${id}`)

        
        setData(res.data)
        Toast.show({
          text1: "Transaction info fetched successfuly"
        })
      } catch (error) {
        Alert.alert("error", error.message || "something went wrong")
      }
    }

    if(id){
      fetchTransaction()
    }
    
  },[id])

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      extraScrollHeight={Platform.OS === "ios" ? 20 : 80} // Optional: Adjusts extra space when keyboard appears
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps='handled'
      keyboardOpeningTime={0}
      
      contentContainerStyle={{ flexGrow: 1 }}
    
    >
      <View className= "mt-5 flex px-3 flex-col mb-10">
        <View className=" relative mb-5">
          <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
            <Ionicons name='arrow-back' size={20} />
          </TouchableOpacity>

          <Text className="font-outfit-medium text-2xl text-center capitalize">Edit transaction</Text>

        </View>

        <ScrollView
          vertical
          showsVerticalScrollIndicator={false}
        >

          <View className="flex flex-grow flex-col w-[100%] mt-2 px-5 ">

            <View className="mb-5">
              <Text className="font-outfit-medium text-xl ">Title</Text>
              <TextInput
                className="w-full p-3 border-2 border-fuchsia-900 rounded-lg outline-none focus:border-fuchsia-700 mt-3 font-outfit-medium text-fuchsia-900"
                value={title}
                placeholder="Enter a title"
                onChangeText={(title) => setTitle(title)}

              />
            </View>

            <View>
              <Text className="font-outfit-medium text-xl ">Amount</Text>
              <TextInput
                className="w-full p-3 border-2 border-fuchsia-900 rounded-lg outline-none focus:border-fuchsia-700 mt-3 font-outfit-medium text-fuchsia-900"
                value={amount}
                placeholder="0"
                onChangeText={(amount) => setAmount(amount)}

              />
            </View>

            <View className="mt-5">
              <Text className="font-outfit-medium text-xl">Category</Text>
              <View className=" flex mt-3 flex-row flex-wrap gap-4">

                {data?.type === "income" && incomeCat.map((cat) =>(
                  <TouchableOpacity 
                    className={`border-2 rounded-lg w-fit px-2 py-1 flex flex-row gap-2 items-center justify-center ${cat.id === category ? "border-fuchsia-600" : "border-gray-400"}`}
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    >
                    <Ionicons name={cat.name} color={"#701a75"} size={20} />
                    <Text className="capitalize font-outfit-semibold text-nowrap">{cat.id}</Text>
                  </TouchableOpacity>
                ))}

                {data?.type === "expense" && expenseCat.map((cat) =>(
                  <TouchableOpacity 
                    className={`border-2 rounded-lg w-fit px-2 py-1 flex flex-row gap-2 items-center justify-center ${cat.id === category ? "border-fuchsia-600" : "border-gray-400"}`}
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    >
                    <Ionicons name={cat.name} color={"#701a75"} size={20} />
                    <Text className="capitalize font-outfit-semibold text-nowrap">{cat.id}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mt-5">
              <Text className="font-outfit-medium text-xl">Date</Text>
              <View className="w-full p-3 border-2 border-fuchsia-900 rounded-lg outline-none focus:border-fuchsia-700 mt-3 font-outfit-medium text-fuchsia-900 relative">
                <Text>{date.toISOString().split("T")[0]}</Text>
                <TouchableOpacity className="absolute right-3 top-2" onPress={handleDatePicker} >
                  
                  <Ionicons name='calendar' size={20} color={"#701a75"}/>
                </TouchableOpacity>
                

              </View>
            </View>
            
            {showIOSPicker && (
              <DateTimePicker
                value={date}
                mode='date'
                onChange={handleIOSChange}
                display='spinner'


              />
            )}

            <TouchableOpacity 
              className="self-center bg-fuchsia-900 rounded-lg mt-5 w-[300px] p-3" 
              onPress={handleEditTransaction}
              disabled={loading}
            >
              <Text className="font-outfit-medium text-xl text-white text-center">
                {loading ? "Loading..." : "Edit Transaction"}
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

      </View>



    </KeyboardAwareScrollView>
  )
}

export default editTransaction
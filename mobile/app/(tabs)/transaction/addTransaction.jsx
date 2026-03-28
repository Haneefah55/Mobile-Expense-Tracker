import { View, Text, TouchableOpacity, TextInput, Platform, Alert, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { useTransactionStore } from '../../../store/transactionStore.js'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const addTransaction = () => {

  const [date, setDate] = useState(new Date())
  const router = useRouter()
  const [showIOSPicker, setShowIOSPicker] = useState(false)
  

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


  const [activeTab, setActiveTab] = useState("income")
  const tabs = [
    { id: "income", title: "Income"},
    { id: "expense", title: "Expense"}
  ]
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



  const { addTransaction, loading, error } = useTransactionStore()

  const [amount, setAmount] = useState(0)
  const [title, setTitle] = useState("")
  const [type, setType] = useState("income")
  const [category, setCategory] = useState("")

  const handleType = (id) =>{
    setActiveTab(id)
    setType(id)
  }

  const handleAddTransaction = async()=>{

 
    if(!type || !title || !amount || !category || !date){
      return Alert.alert("All fields are required")
    }

    console.log(type, title, amount, category, date)

    try {
      await addTransaction(type, title, amount, category, date)
      //Alert.alert("Transaction added successfuly")

      Toast.show({
        text1: "Transaction added successfuly"
      })

      router.replace('/(tabs)/home')
    } catch (error) {
      Alert.alert("error", error.message || "something went wrong")
    } finally {
      setTitle("")
      setDate(new Date())
      setCategory("")
      setAmount(0)
      
    }
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      extraScrollHeight={Platform.OS === "ios" ? 20 : 80} // Optional: Adjusts extra space when keyboard appears
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps='handled'
      keyboardOpeningTime={0}
      
      contentContainerStyle={{ flexGrow: 1 }}
    
    >
      <View className= " flex px-3 py-6 flex-col pb-10">
        <View className=" relative mb-5">
          <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
            <Ionicons name='arrow-back' size={20} />
          </TouchableOpacity>

          <Text className="font-outfit-medium text-2xl text-center capitalize">add transaction</Text>

        </View>

        <View className="flex flow-row items-center justify-center">

          <View className=" flex items-center bg-gray-400 rounded-full justify-center flex-row">
            {tabs.map((tab) => (
              <TouchableOpacity key={tab.id} onPress={() => handleType(tab.id)}>
                <Text className={`font-outfit-medium px-5 py-2 rounded-full text-xl text-white ${tab.id === activeTab ? "bg-fuchsia-800  " : "bg-gray-400 "}`}>{tab.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
        <ScrollView
          vertical
          showsVerticalScrollIndicator={false}
        
        >
          <View className="flex flex-grow flex-col w-[100%] mt-2">
            {
              activeTab === "income" &&
              <View className="mt-5 flex flex-col px-5"> 
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
                    {incomeCat.map((cat) =>(
                      <TouchableOpacity 
                        className={`border-2 rounded-lg w-fit px-2 py-1 flex flex-row gap-2 items-center justify-center ${cat.id === category ? "border-fuchsia-700" : "border-fuchsia-900"}`}
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

                  

              </View>
              
            }
              
            {
              activeTab === "expense" &&

              <View className="mt-5 flex flex-col px-5"> 
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
                    {expenseCat.map((cat) =>(
                      <TouchableOpacity 
                        className={`border-2  rounded-lg w-fit px-2 py-1 flex flex-row gap-2 items-center justify-center ${cat.id === category ? "border-fuchsia-700" : "border-fuchsia-900"}`}
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

                  

              </View>
            }

            <TouchableOpacity 
              className="self-center bg-fuchsia-900 rounded-lg mt-5 w-[300px] p-3" 
              onPress={handleAddTransaction}
              disabled={loading}
            >
              <Text className="font-outfit-medium text-xl text-white text-center">
                {loading ? "Loading..." : "Add Transaction"}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
        
      </View>
    </KeyboardAwareScrollView>
    
  )
}

export default addTransaction
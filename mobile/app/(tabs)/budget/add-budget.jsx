import { View, Text, TouchableOpacity, Platform, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import Toast from 'react-native-toast-message'
import { useBudgetStore } from '../../../store/budgetStore'


const addBudget = () => {

  const router =useRouter()


  const [limit, setLimit] = useState(0)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [period, setPeriod] = useState("")


  console.log(category)
  const budgetCat = [
    {id: "transport", name: "bus" },
    {id: "food", name: "fast-food" },
    {id: "utilities", name: "desktop" },
    {id: "health", name: "fitness" },
    {id: "housing", name: "home" },
    {id: "shopping", name: "cart" },
    {id: "entertainment", name: "game-controller" },
  ]



  const [date, setDate] = useState(new Date())
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

  const { addBudget, error, loading } = useBudgetStore()

  const handleAddBudget = async()=>{
  
   
    if(!period || !title || !limit || !category || !date){
      return Alert.alert("All fields are required")
    }

    const startDate = date
    const limit_amount = limit


    console.log(title, period, limit_amount, startDate, category)

      
  
    try {
      await addBudget(title, period, limit_amount, startDate, category)
      //Alert.alert("Transaction added successfuly")

      Toast.show({
        text1: "New budget added successfuly"
      })

      router.replace('/(tabs)/budget/')
    } catch (error) {
        Toast.show({
          text1: error
        })

    } finally {
        setTitle("")
        setDate(new Date())
        setCategory("")
        setLimit(0)
        setPeriod("")
        
    }
  }
  

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

      <View className= "mt-10 flex px-5 flex-col mb-10">
        <View className=" relative mb-5">
          <TouchableOpacity onPress={() => router.push('/(tabs)/budget/') }>
            <Ionicons name='arrow-back' size={20} />
          </TouchableOpacity>

          <Text className="font-outfit-medium text-2xl text-center capitalize">add budget</Text>

        </View>

        <ScrollView
          vertical
          showsVerticalScrollIndicator={false}
        
        >
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
              <Text className="font-outfit-medium text-xl ">Limit Amount</Text>
              <TextInput
                className="w-full p-3 border-2 border-fuchsia-900 rounded-lg outline-none focus:border-fuchsia-700 mt-3 font-outfit-medium text-fuchsia-900"
                value={limit}
                placeholder="0"
                onChangeText={(limit) => setLimit(limit)}

              />
            </View>

            <View className="mt-5">
              <Text className="font-outfit-medium text-xl ">Period</Text>
              <View className="w-full border-2 border-fuchsia-900 rounded-lg outline-none focus:border-fuchsia-700 mt-3 font-outfit-medium text-fuchsia-900">
                <Picker
                  selectedValue={period}
                  onValueChange={(itemValue, itemIndex) => setPeriod(itemValue)}
            
                >

                  <Picker.Item label='Weekly' value={"weekly"} />
                  <Picker.Item label='Monthly' value={"monthly"} />

                </Picker>
              </View>
              

              


            </View>

            <View className="mt-5">
              <Text className="font-outfit-medium text-xl">Category</Text>
              <View className=" flex mt-3 flex-row flex-wrap gap-4">
                {budgetCat.map((cat) =>(
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

            <TouchableOpacity 
              className="self-center bg-fuchsia-900 rounded-lg mt-5 w-[300px] p-3" 
              onPress={handleAddBudget}
              disabled={loading}
            >
              <Text className="font-outfit-medium text-xl text-white text-center">
                {loading ? "Loading..." : "Add Budget"}</Text>
            </TouchableOpacity>

                  

          </View>
        </ScrollView>
      </View>

    </KeyboardAwareScrollView>
  )
}

export default addBudget
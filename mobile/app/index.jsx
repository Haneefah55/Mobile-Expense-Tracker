import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { Link, useRouter } from 'expo-router'
import { useAuthStore } from '../store/authStore.js'
import axiosInstance from '../utils/axios.js'


const Index = () => {
  const { user } = useAuthStore()
  const router = useRouter()

  const apiUrl = process.env.EXPO_PUBLIC_API_URL

  useEffect(() =>{
    if(user){
      router.replace('/(tabs)/home')
    } 
  }, [user])

  useEffect(() =>{

    const fetch = async() =>{
      try {
        const res = await axiosInstance.get('/fetch')

        Alert.alert('response from backend', res.data.message)
        //console.log('response from backend', res.data)
      } catch (error) {
        console.log(error.message)
      }
      

    }


    fetch()

  }, [])

  
  return (
    <View className="flex-1 items-center px-5 bg-fuchsia-100 justify-center flex-col">
      <View className="mt-20 -mb-3 ">
        <Image
          className="w-[250px] h-[250px] object-contain"
          source={require('../assets/images/icon.png')}

        />
      </View>

      <Text className="font-outfit-bold mb-5 text-fuchsia-950 text-4xl">Track. Analyze. Save.</Text>
      <Text className="font-outfit text-center text-fuchsia-950 mb-3 text-xl w-[280px] ">Effortlessly track your expenses, manage your budget and reach your financial goals faster.</Text>

      <TouchableOpacity 
        onPress={() => router.replace('/(auth)/signup')}
        className="w-[280px] px-3 py-4 bg-fuchsia-900 my-3 rounded-lg">
            
        <Text className="text-white font-outfit-semibold text-xl text-center">Get Started</Text>
          
        
      </TouchableOpacity>



      <TouchableOpacity 
        onPress={() => router.replace('/(auth)/login')}
        className="w-[280px] px-3 py-4 bg-transparent border-2 border-fuchsia-950 my-3 rounded-lg">
          
        <Text className="text-fuchsia-950 font-outfit-semibold text-xl text-center">I Have An Account</Text>
          
      </TouchableOpacity>


    </View>
  )
}

export default Index

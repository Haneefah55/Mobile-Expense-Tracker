import { View, Text, Image, TextInput, TouchableOpacity, Platform, Alert, ScrollView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useEffect, useState } from 'react'
import * as Linking from 'expo-linking'
import { useLocalSearchParams } from 'expo-router';

import { Link, Redirect, useRouter } from 'expo-router'
import { useAuthStore } from '../../store/authStore.js';
import axiosInstance from '../../utils/axios.js';
import Toast from 'react-native-toast-message';
import { Ionicons, Lucide } from '@expo/vector-icons'

import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'

WebBrowser.maybeCompleteAuthSession()


const SignUpScreen = () => {

  const apiUrl = process.env.EXPO_PUBLIC_API_URL
  const start = async() => {
    await WebBrowser.openBrowserAsync(`${apiUrl}/auth/google`)

    //console.log(result)
  }

 



  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [iserror, setIsError] = useState(null)

  const { signup, isLoading, error } = useAuthStore()

  const router = useRouter()
 
  const handleSignUp = async() =>{

    console.log(name, email, password)

    try {

      if(!name || !email || !password){
        
        Alert.alert("All fields are required");
        
        return
        
      }
      
      await signup(name, email, password)
      router.replace('/(auth)/login')
      
    } catch (error) {
      
      //console.error(error)
      

    } 
    
  }

  

  
  return (

    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#fae8ff" }}
      extraScrollHeight={Platform.OS === "ios" ? 20 : 80} // Optional: Adjusts extra space when keyboard appears
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps='handled'
      keyboardOpeningTime={0}
      
      contentContainerStyle={{ flexGrow: 1 }}
    
    >
    
      
      <View className="flex-1 items-center mt-16 mb-10 justify-center font-outfit bg-fuchsia-100 ">

          <Image
            className="w-[250px] h-[250px] object-contain"
            source={require("../../assets/images/icon.png")}
    
          />
    
          <Text className=" mt-5 mb-3 font-outfit-bold  text-4xl ">Create Account</Text>
    
          <TextInput 
            value={name}
            className="p-3 bg-white border-2 border-fuchsia-900 font-outfit rounded-lg  w-[280px] mt-5 placeholder:text-grey-400 "
            placeholder='Enter your username' 
            onChangeText={(name) => setName(name)}
            keyboardType='email-address'
            placeholderTextColor={"#9ca3af"}
            style={{ color: "#000000"}}
    
    
          />

          <TextInput 
            value={email}
            className="p-3 bg-white border-2 border-fuchsia-900 font-outfit rounded-lg  w-[280px] mt-5 placeholder:text-grey-400"
            placeholder='Enter your email'
            autoCapitalize='none'
            onChangeText={(email) => setEmail(email)}
            placeholderTextColor={"#9ca3af"}
            style={{ color: "#000000"}}
    
    
          />

          <TextInput 
            value={password}
            className="p-3 bg-white border-2 border-fuchsia-900 font-outfit rounded-lg  w-[280px] mt-5 placeholder:text-grey-400"
            placeholder='Enter your password'
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            placeholderTextColor={"#9ca3af"}
            style={{ color: "#000000"}}
    
    
          />
          {error && <Text className="my-5 text-red-600 font-outfit-medium text-sm">{error}</Text>}
          <TouchableOpacity className="w-[280px] bg-fuchsia-950 text-white mt-7 p-3 flex rounded-lg items-center justify-center" onPress={handleSignUp} disabled={loading}>
            <Text className="text-white font-outfit-semibold text-2xl">
              {isLoading ?  "Loading..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
    
          <View className="flex flex-row mt-4 items-center justify-center">
            <Text className="text-gray-700 font-outfit-medium text-xl">Already have an account?</Text>
        
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text className="text-gray-500 ml-2 font-outfit-medium text-xl">Log In</Text>
            </TouchableOpacity>
            
    
          </View>

          <View className="flex mt-4 bg-fuchsia-800 w-[280px]  h-0.5">
          
          </View>
  
          <Text className="text-center font-outfit-medium text-lg mt-3">Continue with</Text>
  
          <TouchableOpacity className="w-[280px] mb-10 bg-white text-white mt-4 p-3 flex rounded-lg items-center justify-center" onPress={() => start()}>
            <Image 
              className="w-[70px] h-[23px] object-contain"
              source={require("../../assets/images/goo.png")}
            
            />
          </TouchableOpacity>
    
          
      </View>
  
      
    </KeyboardAwareScrollView>
      
  )
}

export default SignUpScreen
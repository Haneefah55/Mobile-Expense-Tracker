import { View, Text, Image, TextInput, TouchableOpacity, Alert, Platform } from 'react-native'
import { KeyboardAwareScrollView,  } from 'react-native-keyboard-aware-scroll-view';
import React, { useEffect, useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { useAuthStore } from '../../store/authStore';
import { Ionicons, Lucide } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser'
//import { EXPO_PUBLIC_API_URL } from '@env'

WebBrowser.maybeCompleteAuthSession()


const LoginScreen = () => {

  const apiUrl = 'http://10.45.55.215:5000/api' //process.env.EXPO_PUBLIC_API_URL

  const start = async() => {
      await WebBrowser.openBrowserAsync(`${apiUrl}/auth/google`)
  
      //console.log(result)
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { login, isLoading, error, user } = useAuthStore()

  const handleLogin = async() =>{

     if(!email || !password){
      Alert.alert("Please fill all the fields")
      return
    }
    console.log(email, password)

    await login(email, password)
   
  }

  useEffect(() =>{

    if(user){
      router.replace('/(tabs)/home')
    }
  }, [user])


  return (

    <KeyboardAwareScrollView 
      style={{ flex: 1, backgroundColor: "#fae8ff" }}
      extraScrollHeight={Platform.OS === "ios" ? 20 : 50} // Optional: Adjusts extra space when keyboard appears
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps='handled'
      keyboardOpeningTime={0}
      
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 bg-fuchsia-100 items-center justify-center w-[100%] px-4">

        <Image
          className="w-[60px] h-[60px] mt-20 object-contain"
          source={require("../../assets/images/icon.png")}
  
        />
        <Text className="mt-3 mb-7 font-outfit-bold text-4xl text-fuchsia-900">
          Wallet 
        </Text>

        <Text className="font-outfit-bold text-3xl mt-3 ">Welcome Back</Text>

        <TextInput 
          value={email}
          className="p-3 bg-white border-2 border-fuchsia-900 font-outfit rounded-lg  w-[280px] mt-3 placeholder:text-grey-400"
          placeholder='Enter your email'
          autoCapitalize='none'
          placeholderTextColor={"#9ca3af"}
          onChangeText={(email) => setEmail(email)}
          style={{ color: "#000000"}}
          keyboardType='email-address'

        />

        <TextInput 
          value={password}
          className="p-3 bg-white border-2 border-fuchsia-900 font-outfit rounded-lg  w-[280px] mt-3 placeholder:text-grey-400"
          placeholder='Enter your password'
          secureTextEntry={true}
          autoCapitalize='none'
          placeholderTextColor={"#9ca3af"}
          style={{ color: "#000000"}}
          onChangeText={(password) => setPassword(password)}

        />

        {error && 
        <View className="mt-5 mb-5">

          <Text className='text-lg text-red-600 font-outfit-medium'>{error}</Text>

        </View>
        
        }


        <TouchableOpacity className="w-[280px] bg-fuchsia-900 text-white mt-3 p-3 flex rounded-lg items-center justify-center" onPress={handleLogin}>
          <Text className="text-white font-outfit-semibold text-2xl">
            {isLoading ? 
              "Loading..."
            : "Log In"}
          </Text>
        </TouchableOpacity>

        <View className="flex flex-row mt-3 items-center justify-center">
          <Text className="text-gray-700 text-xl font-outfit-medium">Don't have an account?</Text>
         
          <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}>
            <Text className="text-gray-600 ml-2 text-xl font-outfit-medium">Sign Up</Text>
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

export default LoginScreen
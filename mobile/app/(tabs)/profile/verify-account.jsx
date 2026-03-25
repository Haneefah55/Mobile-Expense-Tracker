import { View, Text, TouchableOpacity, Platform, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../../store/authStore'
import Toast from 'react-native-toast-message'

const verifyAccount = () => {

  const router = useRouter()

  const { user, verifyCode, isLoading, error, resendCode } = useAuthStore()

  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])

  const handleChange = (text, index) =>{

    const newCode = [...code]

    if(text.length > 1){
      const pastedCode = text.slice(0, 6).split("")
      for (let i = 0; i < 6; i++){
        newCode[i] = pastedCode[i] || ""
      }
      setCode(newCode)
      
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "")
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5
      inputRefs.current[focusIndex].focus()
    } else {
      newCode[index] = text
      setCode(newCode)
          // move cursor to the next input field
      if(text && index < 5){
        inputRefs.current[index + 1].focus()
      }
    }
  }

  const handleKeyPress =(e, index) =>{
    if(e.nativeEvent.key === "Backspace" && !code[index] && index > 0){
      inputRefs.current[index - 1].focus()
    }
  }

  const handleSubmit = async () =>{
    
    const verificationCode = code.join("")
    console.log(verificationCode)

    try{
      await verifyCode(verificationCode)
      

      Toast.show({
        text1: "Account verified successfuly"
      })

      router.replace('/(tabs)/profile/index')
      
    } catch (error) {
      console.log(error)
      
      
    } finally{
      setCode(["", "", "", "", "", ""])
    }

    


  }
    
  const handleResend = async() =>{
    
    try{
      await resendCode()
    
      
    } catch (error) {
      console.log(error)
      
    }

    setCanResend(false)
    setTimeLeft(60)
    setCode(["", "", "", "", "", ""])
    Toast.show({
      text1: "verification code resent successfuly"
    })



  
    
    
  }

  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false)
  const [visible, setVisible] = useState(true)



  useEffect(() =>{
    if(code.every((digit) => digit !== "")){
      handleSubmit()
    }
    
    
    
  
  }, [code])

  useEffect(() => {

    if(!canResend){
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timerInterval);
            // Perform actions when the timer reaches zero
            setCanResend(true)
            setVisible(false)
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    
      return () => clearInterval(timerInterval)
    }

    

  }, [])
  
  


  return (
    <View className="flex-1 p-5 flex-col mt-4 bg-gray-100">
      <View className=" mb-5">
        <TouchableOpacity className="" onPress={() => router.replace('/(tabs)/profile/index') }>
          <Ionicons name='arrow-back' size={20} />
        </TouchableOpacity>

        <Text className="font-outfit-medium text-3xl text-center capitalize">Verify Account</Text>

      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 50} // Optional: Adjusts extra space when keyboard appears
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps='handled'
        keyboardOpeningTime={0}
        
        contentContainerStyle={{ flexGrow: 1 }}
      >

        <View className="flex-1 items-center justify-center w-[100%] px-6">

          <View className="flex bg-white shadow-md rounded-lg p-6 flex-col items-center justify-center">

            <View className="flex bg-fuchsia-200 p-3 items-center rounded-full justify-center">
              <Ionicons name='lock-closed-outline' size={25} color={'#701a75'} />
            </View>

            <Text className="font-outfit-semibold text-2xl mt-3 mb-4">Verify Account</Text>
            <Text className="font-outfit mb-6 text-center text-md">Enter the 6-digit code sent to your email to verify your account</Text>


            <View className="flex flex-row gap-3">
              {code.map((digit, index) =>(
                <TextInput 
                  key={index}
                  keyboardType='number-pad'
                  
                  maxLength={6}
                  ref={(el) =>(inputRefs.current[index] = el)}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  className="w-10 h-12 text-center font-outfit-semibold text-xl border-2 focus:border-fuchsia-300 bg-gray-100 outline-none mb-5 border-fuchsia-800 rounded-lg text-fuchsia-800"
                />
              ))
              }
            </View>

            <TouchableOpacity 
              className=" mb-5 text-xs text-gray-900  flex flex-row items-center justify-center"
              onPress={handleResend}
              disabled={visible}
            >

              
              <Text className="text-lg font-outfit-medium ">resend code</Text>
              <Text className={` ${visible ? "flex" : "hidden"} text-lg font-outfit-medium`}
              > in 00: {timeLeft}</Text>
            </TouchableOpacity>

            {
              error && 
              <View className="flex flex-row justify-center items-center gap-3 py-2 px-3 bg-gray-200 border-t-2 border-red-600 mb-6 ">
                <Ionicons name='alert-circle' size={20} color={"#dc2626"}/>
                <Text className="font-outfit text-md text-red-600">{error}</Text>
                
              </View>
            }

            <TouchableOpacity className="p-3 bg-fuchsia-800 rounded-lg flex items-center justify-center" onPress={handleSubmit}>
              {
                isLoading ? 
                <Text className="text-xl text-white font-outfit-medium">Verifying...</Text> :
                <Text className="text-xl text-white font-outfit-medium">Verify</Text>
              }
            </TouchableOpacity>




          </View>
          
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default verifyAccount
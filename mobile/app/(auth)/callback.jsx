import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore.js'
import { useLocalSearchParams, useRouter } from 'expo-router'

const callback = () => {

  const { verifyAuthCode, user } = useAuthStore()

  console.log("user", user)

 

  const router = useRouter()

  const { code } = useLocalSearchParams()

  console.log("code", code)
  
  if(user) {
    router.replace('/(tabs)/home')
  }

  useEffect(() =>{


    verifyAuthCode(code)

  },[code]) 

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-outfit-medium capitalize">authenticating ...</Text>
    </View>
  )
}

export default callback
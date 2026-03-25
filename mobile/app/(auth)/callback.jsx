import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore.js'
import { useLocalSearchParams, useRouter } from 'expo-router'

const callback = () => {

  const { verifyToken, user } = useAuthStore()

  console.log("user", user)

 

  const router = useRouter()

  const { token } = useLocalSearchParams()

  console.log("token", token)
  
  if(user) {
    router.replace('/(tabs)/home')
  }

  useEffect(() =>{


    verifyToken(token)

  },[token]) 

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-outfit-medium capitalize">authenticating ...</Text>
    </View>
  )
}

export default callback
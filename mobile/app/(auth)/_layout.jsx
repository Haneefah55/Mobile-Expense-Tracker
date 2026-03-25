import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect, useRouter, Stack } from 'expo-router'
import { useAuthStore } from '../../store/authStore.js'
import SafeScreen from '../../components/SafeScreen.jsx'

const AuthLayout = () => {

  

  return (
    

      <Stack>
        <Stack.Screen name='login' options={{ headerShown: false }} />
        <Stack.Screen name='signup' options={{ headerShown: false }} />
        <Stack.Screen name='callback' options={{ headerShown: false }} />
      </Stack>
      
    
    
  )
}

export default AuthLayout
import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileLayout = () => {
  return (

    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='view-profile' />
        <Stack.Screen name='verify-account' />
        
      </Stack>
    </SafeAreaView>
    
  )
}

export default ProfileLayout
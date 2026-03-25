import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const TransactionLayout = () => {
  return (

    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='addTransaction' />
        <Stack.Screen name='allTransaction' />
        <Stack.Screen name='edit-transaction/[id]' />
      </Stack>
    </SafeAreaView>
    
  )
}

export default TransactionLayout
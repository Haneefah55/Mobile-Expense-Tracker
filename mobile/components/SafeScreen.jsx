import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeScreen = ({ children }) => {

  //const insets = useSafeAreaInsets()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      {children}
    </SafeAreaView>
  )
}

export default SafeScreen
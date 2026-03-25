import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'

const ChangeName = () => {
  return (
    <View className=" flex flex-col">
      <Text className="font-outfit-medium text-xl mb-4">Change Your Username</Text>
      <TextInput 
        
        className="bg-gray-200 border border-fuchsia-800"
        >

      </TextInput>
    </View>
  )
}

export default ChangeName
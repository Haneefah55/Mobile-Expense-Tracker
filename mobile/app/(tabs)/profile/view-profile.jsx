import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuthStore } from '../../../store/authStore.js'
import ChangeName from '../../../components/ChangeName.jsx'
import ChangeEmail from '../../../components/ChangeEmail.jsx'


const editProfile = () => {

  const router = useRouter()

  const [tab, setTab] = useState("")

  const { user } = useAuthStore()


  return (
    <View  className="flex-1 p-5 flex-col mt-4 bg-gray-100">
      <View className=" mb-5">
        <TouchableOpacity className="" onPress={() => router.push('/(tabs)/profile/') }>
          <Ionicons name='arrow-back' size={20} />
        </TouchableOpacity>

        <Text className="font-outfit-medium text-2xl text-center capitalize">Profile </Text>

      </View>

      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
      >
        <View className="flex w-[100%] flex-col pt-5 mb-6 pb-6 px-4 shadow-md bg-white">

          <View className="flex items-center justify-center relative">


            {user?.image ? (<Image source={{ uri: user?.image }} className="w-[70] h-[70] object-contain rounded-full mr-3"/>) 
                      
            : (<View className="w-[70px] h-[70px] mr-3 object-contain rounded-full flex bg-fuchsia-900 items-center justify-center">
              <Text className="text-white text-3xl font-outfit-semibold">{user?.name?.charAt(0)}</Text>
            </View>)
            }

            <TouchableOpacity className="-mt-5 ml-10 flex items-center bg-gray-200 rounded-full p-1  justify-center">
              <MaterialIcons name="add-a-photo" size={18} color="#701a75" />
            </TouchableOpacity>

          </View>

          <View className="flex flex-col mt-5">
            <View className="flex flex-row mb-4 items-center justify-between">
              <View className="flex flex-row  gap-2 items-center">
                <Text className ="font-outfit text-xl">Name:</Text>
                <Text className="capitalize font-outfit-bold text-xl">{user?.name}</Text>
              </View>


              <TouchableOpacity onPress={() => setTab("name")}>
                <FontAwesome6 name='edit' size={18} color={"#701a75"} />
              </TouchableOpacity>

            </View>

            <View className="flex flex-row mb-4 items-center justify-between">
              <View className="flex flex-row  gap-2 items-center">
                <Text className ="font-outfit text-xl">Email:</Text>
                <Text className="font-outfit-bold text-xl">{user?.email}</Text>
              </View>


              <TouchableOpacity onPress={() => setTab("name")}>
                <FontAwesome6 name='edit' size={18} color={"#701a75"} />
              </TouchableOpacity>

            </View>

          </View>

          <View className="flex flex-row mb-4 items-center justify-between">
            <View className="flex flex-row  gap-2 items-center">
              <Text className ="font-outfit text-xl">Account Verified:</Text>
              <Text className="capitalize font-outfit-bold text-xl">{user?.isVerified ? "Yes" : "No"}</Text>
            </View>


          </View>


        </View>

        {
          tab === "name" &&

          <View className="flex w-[100%] pt-5 mb-6 pb-6 px-4 shadow-md bg-white ">
            <ChangeName />
          </View>
        }
      </ScrollView>
    </View>
  )
}

export default editProfile


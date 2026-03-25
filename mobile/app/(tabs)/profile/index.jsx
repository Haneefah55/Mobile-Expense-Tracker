import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useAuthStore } from '../../../store/authStore.js'
import { useRouter } from 'expo-router'
import { Ionicons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'

const profile = () => {

  const { logout, user, verifyAccount, isLoading, error } = useAuthStore()

  console.log(user)

  const joined = new Date(user?.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    
  
  })

  ///console.log(joined)
  
  const router = useRouter()
  const handleLogout = async() =>{

    try {
      await logout()
      
      router.push('/(auth)/login')
    } catch (error) {
      console.log(error)
    }
  }

  const handleVerification = async() =>{

    try {
      await verifyAccount()

      router.replace('/(tabs)/profile/verify-account')

    } catch (error) {
      console.log(error)
      Toast.show({
          text1: error
      })
    }

    

  }



  return (
    <View className="flex-1 p-5 flex-col mt-4 bg-gray-100">
      <View className=" mb-5">
        <TouchableOpacity className="" onPress={() => router.replace('/(tabs)/home') }>
          <Ionicons name='arrow-back' size={20} />
        </TouchableOpacity>

        <Text className="font-outfit-medium text-3xl text-center capitalize">Me</Text>

      </View>

      <View className="flex bg-white rounded-lg shadow-md p-3">
        <View className="flex flex-row gap-2 items-center">
          {user?.image ? (<Image source={{ uri: user?.image }} className="w-[50px] h-[50px] object-contain rounded-full mr-3"/>) 
                    
          : (<View className="w-[50px] h-[50px] mr-3 object-contain rounded-full flex bg-fuchsia-900 items-center justify-center">
            <Text className="text-white text-3xl font-outfit-semibold">{user?.name?.charAt(0)}</Text>
          </View>)
          }


          <View className="flex flex-col ">
            <Text className="text-2xl capitalize font-outfit-medium">{user?.name}</Text>
            <Text className="text-lg font-outfit text-gray-500">Joined: {joined}</Text>
          
              {
                user?.isVerified ? (
                  <View className="flex flex-row gap-1 items-center">
                    <Text className="font-outfit-semibold text-green-700 text-sm">Verified </Text>
                    <Ionicons name='checkmark-circle' size={15} color={"#15803d"}/>
                  </View>
                ) : (
                  <View className="flex flex-row gap-1 items-center">
                    <Text className="font-outfit-semibold text-red-600 text-sm">Not Verified </Text>
                    <Ionicons name='alert-circle' size={15} color={"#dc2626"}/>
                  </View>
                )
              }
          
              
                      
            


          </View>

        </View>

        

      </View>

      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
      >
        <View className="flex w-[100%] flex-col mt-5 mb-6">
          <View className="flex flex-col p-4 bg-white  rounded-lg shadow-md">
            <View className="flex flex-row items-center gap-3">
         
              <Ionicons name='person' size={25} color={"#701a75"}/>
              
              
              <Text className="text-2xl font-outfit-medium">Profile</Text>
            </View>

            <View className="flex flex-col mb-3 ml-2 mt-4">
              <View className="flex flex-row items-center justify-between px-3 py-2 shadow-md"> 
                <View className="flex flex-row items-center ">
                  <Ionicons name='person' size={20} color={"#701a75"}/>
              
                  <Text className="text-lg ml-3 font-outfit-medium">View profile</Text>
                </View>
            
                
                <TouchableOpacity className="bg-fuchsia-100 self-end shadow-md rounded-lg p-2" onPress={() => router.replace('(tabs)/profile/view-profile')}>
                  <Ionicons name='chevron-forward' size={15} color={"#701a75"} />

                </TouchableOpacity>
              </View>

              <TouchableOpacity className="flex flex-row px-3 py-2 gap-3" onPress={handleLogout}>
                <Ionicons name='log-out' size={20} color={"#701a75"}/>
                <Text className="text-lg font-outfit-medium">Logout</Text>

              </TouchableOpacity>

              <TouchableOpacity className="flex flex-row px-3 py-2 gap-3">
              <Ionicons name='trash' size={20} color={"#701a75"}/>
              <Text className="text-lg font-outfit-medium">Delete Account</Text>

              </TouchableOpacity>

              

            </View>

            {
              !user?.isVerified &&

              <View className="flex flex-col mt-5">

                <View className=" flex flex-row items-center">
                  <Text className="font-outfit-semibold text-red-600 text-xl">Account Not Verified </Text>
                  <Ionicons name='alert-circle' size={20} color={"#dc2626"}/>
                  </View>
                <Text className="font-outfit-medium mt-3">You account has not been verified, click below to verify your account</Text>

                <TouchableOpacity className="bg-fuchsia-800 p-3 mt-4 ml-3 w-[150px] rounded-lg shadow-md " onPress={handleVerification}>
                  {
                    isLoading ? <FontAwesome6 name="spinner" size={24} color="white" className="animate-spin mx-auto" /> :

                    <Text className="text-white text-center font-outfit-semibold text-xl">Verify Account</Text>
                  }
                  
                </TouchableOpacity>
              

              </View>
            }

          </View>

          <View className="flex flex-col p-4 bg-white  rounded-lg shadow-md mt-5">
            <View className="flex flex-row items-center gap-3">
         
              <Ionicons name='settings' size={25} color={"#701a75"}/>
              
              
              <Text className="text-2xl font-outfit-medium">Settings</Text>
            </View>
            <View className="flex flex-col mb-3 ml-2 mt-4">

              <View className="flex flex-row items-center justify-between px-3 py-2 shadow-md"> 
                <View className="flex flex-row items-center ">
                  <Ionicons name="notifications"  size={20} color={"#701a75"}/>
    
              
                  <Text className="text-lg ml-3 font-outfit-medium">Notifications</Text>
                </View>
            
                
                <TouchableOpacity className="bg-fuchsia-100 self-end shadow-md rounded-lg p-2">
                  <Ionicons name='chevron-forward' size={15} color={"#701a75"} />

                </TouchableOpacity>
              </View>
              <View className="flex flex-row items-center justify-between px-3 py-2 shadow-md"> 
                <View className="flex flex-row items-center ">
                  <Ionicons name="lock-closed"  size={20} color={"#701a75"}/>
    
              
                  <Text className="text-lg ml-3 font-outfit-medium">Privacy & Security</Text>
                </View>
            
                
                <TouchableOpacity className="bg-fuchsia-100 self-end shadow-md rounded-lg p-2">
                  <Ionicons name='chevron-forward' size={15} color={"#701a75"} />

                </TouchableOpacity>
              </View>
              <View className="flex flex-row items-center justify-between px-3 py-2 shadow-md"> 
                <View className="flex flex-row items-center ">
                  <Ionicons name="help-circle"  size={20} color={"#701a75"}/>
    
              
                  <Text className="text-lg ml-3 font-outfit-medium">FAQ</Text>
                </View>
            
                
                <TouchableOpacity className="bg-fuchsia-100 self-end shadow-md rounded-lg p-2">
                  <Ionicons name='chevron-forward' size={15} color={"#701a75"} />

                </TouchableOpacity>
              </View>
              
            </View>



          </View>

          

          

        </View>

      </ScrollView>
      
    </View>
  )
}

export default profile
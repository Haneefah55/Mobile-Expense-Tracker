import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect, useRouter, Stack, Tabs } from 'expo-router'

import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'


const Layout = () => {

  const router = useRouter()

  return (

    <SafeAreaView style={{ flex: 1 }}>
      <Tabs 
        screenOptions={{ 
          headerShown: false, 
          tabBarActiveTintColor: "#701a75",
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: {
            backgroundColor: "#fff",
          
            paddingBottom: 1,
            paddingTop: 1,
            height: 80,
          
          },

          tabBarLabelStyle: {
            fontSize: 15,
            fontFamily: "OutfitSemiBold"
          }

        }}
      >
        <Tabs.Screen
          name='home'

          options={{
            title:"Home",
            tabBarIcon: ({ color }) => <Ionicons name='home' size={20} color={color} />
            

          }}

        />

        <Tabs.Screen
          name='analytics'
          options={{
            title:"Analytics",
            tabBarIcon: ({ color }) => <Ionicons name='bar-chart' size={20} color={color} />
            
            

          }}

        />


        <Tabs.Screen
          name='transaction'
          options={{
            title:"Add",
            tabBarIcon: () => (
              
            
              <TouchableOpacity className="flex items-center justify-center bg-red-600 w-7 h-7 p-7 rounded-full -top-5" onPress={() => router.replace('/(tabs)/transaction/addTransaction')}>
              
                  <Ionicons name='add' size={30} color={"#fff"} style={{ position: 'absolute'}} />
            
              </TouchableOpacity>
          
              
          
            ),
            tabBarLabel: "",
            
          }}
          
        
          

        />

        <Tabs.Screen
          name='budget'
          options={{
            title:"Budget",
            tabBarIcon: ({ color }) => <Ionicons name='bag-handle' size={20} color={color}/>
            

          }}

        />

        <Tabs.Screen
          name='profile'
          options={{
            title:"Me",
            tabBarIcon: ({ color }) => <Ionicons name='person' size={20} color={color}/>
            

          }}

        />

        

        
        

      </Tabs>
    </SafeAreaView>
    
    
    
  )
}

export default Layout
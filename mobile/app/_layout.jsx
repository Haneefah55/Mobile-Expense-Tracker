import { Stack, useLocalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';
import { useLinkingURL } from 'expo-linking';
import * as Linking from 'expo-linking'

import * as SplashScreen from 'expo-splash-screen'

import '../global.css'
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font'
import { ActivityIndicator, Alert, Animated, View } from 'react-native';
import axios from '../utils/axios.js'


import { useAuthStore } from '../store/authStore.js';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar'


SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const fadeAnim = useRef(new Animated.Value(0)).current


  const { checkAuth, isAuthenticated, user, logout } = useAuthStore()

  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)

 // console.log("user", user)
  const [fontsLoaded] = useFonts({
    'OutfitRegular': require('../assets/fonts/Outfit-Regular.ttf'),
    'OutfitBold': require('../assets/fonts/Outfit-Bold.ttf'),
    'OutfitMedium': require('../assets/fonts/Outfit-Medium.ttf'),
    'OutfitSemiBold': require('../assets/fonts/Outfit-SemiBold.ttf'),
    'OutfitThin': require('../assets/fonts/Outfit-Thin.ttf'),
  })


  
  useEffect(() =>{

    async function prepareApp() {
      try {

        await new Promise(resolve => setTimeout(resolve, 3000))

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,

        }).start(async () =>{
          await SplashScreen.hideAsync()
        })
        


        
      } catch (error) {
        console.warn(error)
      }
      
    }

    prepareApp()
  }, [])

  useEffect(() =>{
    const initAuth = async() =>{
      await checkAuth()
      setIsReady(true)
    }


    initAuth()
  }, [])

  useEffect(() =>{
    if(!isReady || !router.canGoBack()) return

    //const inAuthGroup = segment[0] === '(auth)'
    const isAuthRoute = pathname.includes('(auth)')
    const isTabsRoute = pathname.includes('(tabs)')
    if(user && isAuthRoute) {
      router.replace('/(tabs)')
    } 

  }, [isAuthenticated, pathname, isReady, user])


  if(!fontsLoaded){

    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size='large' color='#701a75' />
      </View>
    )
  } 




  return (
    
      <SafeAreaProvider>
        <Animated.View className="flex-1 ">
          <StatusBar  style='light'  backgroundColor='#000' />
          <Stack>
            
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='(auth)' options={{ headerShown: false }} />
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            
          </Stack>
          <Toast />
 
        </Animated.View>
        
      </SafeAreaProvider>
        
        
    


    
      

  );
}

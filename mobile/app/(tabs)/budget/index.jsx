import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { getMonths } from '../../../utils/getWeeks.js'
import axios from '../../../utils/axios.js'
import { PieChart } from 'react-native-gifted-charts'
import { useBudgetStore } from '../../../store/budgetStore.js'

const budgetHome = () => {

  const [isDrop, setIsDrop] = useState(false)
  const router = useRouter()

  const month = getMonths()

  const { fetchMontlyOverall, budget, spent, balance, percent, categoryData } = useBudgetStore()

  const [start, setStart] = useState(month[0].start.slice(0, 7))
  const [label, setLabel] = useState(month[0].dateRange)

  const categoryIcon = {

    transport: "bus",
    food: "fast-food",
    utilities: "desktop",
    health: "fitness",
    housing: "home",
    shopping: "cart",
    entertainment: "game-controller",

  }

 

  const overallChart = [

    {
      value: percent / 2,
      color: "#16a34a"
    },
 
    {
      value: percent - (percent / 2),
      color: '#dc2626',

    },
//16a34a 4ade80 f87171 dc2626
 

   
    
    {
      value: 100 - percent, // 100 - 70 = 30
      color: '#e0e0e0'
    }
  ]

  const genHeatSlices = (percent) => {
    const ranges = [
      { limit: 40, color: "#16a34a"},
      { limit: 70, color: "#facc15"},
      { limit: 100, color: "#dc2626"},
    ]

    let remaining = percent
    
    const slices = []

    for (const r of ranges) {
      if(remaining <= 0) break

      const sliceValue = Math.min(remaining, r.limit - (slices.reduce((a, b) => a + b.value, 0)))

      if (sliceValue > 0 ) {
        slices.push({
          value: sliceValue,
          color: r.color
        })

        remaining -= sliceValue

      }

    
    }

    slices.push({
      value: 100 - percent,
      color: "#d3d3d3"
    })

    return slices
  }

  

  const handleSelect = (item) =>{

    setLabel(item.dateRange)
    setStart(item.start.slice(0, 7))
    setIsDrop(!isDrop)
    

  }

  useEffect(() =>{

    fetchMontlyOverall(start)
    

  },[start])

  return (
    <View className=" bg-gray-50 mt-15  relative px-4 py-4 flex-1 flex-col">

      <View className=" mb-5">
        <TouchableOpacity className="" onPress={() => router.push('/(tabs)/home') }>
          <Ionicons name='arrow-back' size={20} />
        </TouchableOpacity>

        <Text className="font-outfit-medium text-3xl text-center capitalize">Budget</Text>

      </View>

      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
      
      >
        <View className="flex w-full mt-3 flex-col">

          <View className="relative flex flex-row px-4 items-center justify-between">

            <Text className="font-outfit-semibold text-2xl">Overall Budget</Text>
            <TouchableOpacity className="flex flex-row gap-3 items-center justify-center border-2 border-fuchsia-900 p-2 rounded-lg" onPress={() => setIsDrop(!isDrop)}>
              <Text className="font-outfit-medium text-xl" >{label}</Text>
              <Ionicons name='chevron-up' size={20} className={`${isDrop ? "flex" : "hidden"}`}/>
              <Ionicons name='chevron-down' size={20} className={`${isDrop ? "hidden" : "flex"}`}/>
            </TouchableOpacity>

            <View className ={`${isDrop ? "flex" : "hidden"} absolute flex-col items-left justify-center p-2 top-12 shadow-md right-2 w-[150px] bg-white z-20 h-[150px]`}>
            
              {month.map((item) => (
                <TouchableOpacity key={item.start} onPress={() =>handleSelect(item)}>
                  <Text className="text-xl ml-3 mb-2  ">{item.dateRange}</Text>
                </TouchableOpacity>
              ))}



            </View>

          </View>
      
          <View className="bg-fuchsia-900 mt-3 w-full h-[180px] rounded-xl shadow-md p-4 flex flex-row items-center justify-between px-5">

            {budget === 0 &&
              <View className="flex flex-col items-center justify-center">
                <Text className="text-white text-2xl font-outfit-semibold">No budget found for this month</Text>
                <TouchableOpacity className="mt-4" onPress={() => router.push('/(tabs)/budget/add-budget')}>
                  <Text className="text-white mt-3 text-xl font-outfit-semibold">Create budget</Text>
                </TouchableOpacity>
                
                
              </View>
            }
            {
              budget > 0 &&

              <View className="flex flex-col">
                <Text className="text-lg text-white font-outfit-medium">Total Budget</Text>
                <Text className="text-xl text-white font-outfit-bold">&#8358; {budget.toLocaleString()}</Text>
                <Text className="text-lg mt-4 text-white font-outfit-medium">Total Spent</Text>
                <Text className="text-xl text-white font-outfit-bold">&#8358; {spent.toLocaleString()}</Text>
                <Text className="text-gray-200 font-outfit text-wrap mt-3">Remaining &#8358; {balance.toLocaleString()}</Text>

              </View>
            }

            

            <View className="flex ml-6 ">

              {budget > 0 &&

              <PieChart
                data={genHeatSlices(percent)}

                donut
                radius={70}
                innerRadius={50}

                centerLabelComponent={() => {
                  return(
                    <View className="flex flex-col items-center justify-center">
                      <Text className="text-xl font-outfit-semibold text-black">
                        {Math.round(percent)}%</Text>
                      <Text className="text-sm font-outfit-medium text-black">Total Spent</Text>
                    </View>
                  )
                }}

              />

              }

            </View>



          </View>


          <View className="flex flex-col mt-8 relative">

            <Text className="font-outfit-semibold text-2xl">
               Category Budget
            </Text>

            {
              categoryData.length === 0 && 
              <View className="flex items-center justify-center mt-5">
                <Text className="text-xl font-outfit-semibold ">No data found</Text>

              </View>
            }

            {
              categoryData.length > 0 && 
              <View className=" mt-5 flex  flex-col items-center justify-center gap-3">
                {categoryData.map((data) =>(
                  <View key={data.category} className="flex w-full px-3 py-4 flex-row mb-4 items-center bg-gray-200 shadow-md justify-between ">
                    <View className="flex flex-row items-center justify-center">
                      <View className="bg-fuchsia-900 p-2  rounded-full">
                        <Font name={`${categoryIcon[data.category]}`} />
                      </View>

                      <View className="flex flex-row gap-2 ml-3 items-center justify-center ">
                        <Text className="text-xl font-outfit-medium capitalize ">
                          {data.category}
                        </Text>

                        {
                          categoryData.length > 0 && 
                          <View>
                            <PieChart

                            data={genHeatSlices(data.percent)}

                              donut
                              radius={25}
                              innerRadius={18}

                              centerLabelComponent={() => {
                                return(
                                  <View className="flex items-center justify-center">
                                    <Text className="text-md font-outfit-semibold text-black">
                                      {Math.round(data.percent)}%</Text>
                                    
                                  </View>
                                )
                              }}

                            />
                          </View>
                        }

                      </View>
                    </View>

                    <View className="flex flex-wrap  ml-8 ">
                      <Text className={`text-md text-wrap w-[120px] font-outfit-medium ${data.totalBudget >= data.totalSpent ? "" : "text-red-600"}`}>
                        {data.totalBudget >= data.totalSpent ? `Your spending is ${data.remaining.toLocaleString()} less than your budget ` : `You are above your budget limit!!!`}
                      </Text>
 
                    </View>


                    
                  </View>
                ))

                }
              </View>
            }

            



          </View>
        </View>

        

        

      </ScrollView>

      <View className="absolute top-[55%]  z-20 right-3">
        <TouchableOpacity className="w-10 h-10 text-white p-7 rounded-full shadow-md bg-fuchsia-800 flex items-center justify-center" onPress={() => router.push('/(tabs)/budget/add-budget')}>

          <Ionicons name='add' size={25} color={"#fff"} style={{ position: 'absolute'}}/>

        </TouchableOpacity>

      </View>
    </View>
  )
}

export default budgetHome


const Font = ({ name }) =>(
  <Ionicons name={name} size={25} color={'#fff'} />
)
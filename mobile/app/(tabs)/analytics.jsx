import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { getMonths, getPreviousMonths } from '../../utils/getWeeks.js'
import { BarChart, PieChart } from 'react-native-gifted-charts'
import axios from '../../utils/axios.js'

const analytics = () => {

  const router = useRouter()

  const months = getPreviousMonths()

  const result = getMonths()

  const fontCat = [
    {id: "salary", name: "bus" },
    {id: "freelance", name: "construct" },
    {id: "business", name: "business" },
    {id: "investments", name: "pulse" },
    {id: "gift", name: "gift" },
    {id: "rentals", name: "home" },
    {id: "others", name: "cash-outline" },
    {id: "transport", name: "bus" },
    {id: "food", name: "fast-food" },
    {id: "utilities", name: "desktop" },
    {id: "health", name: "fitness" },
    {id: "housing", name: "home" },
    {id: "shopping", name: "cart" },
    {id: "entertainment", name: "game-controller" },
  ]

 // console.log("result", result)
 

  const [isDrop, setIsDrop] = useState(false)
  const [isDropB, setIsDropB] = useState(false)
  const [data, setData] = useState([])
  const [incomeData, setIncomeData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [category, setCategory] = useState("")


  const [startMonth, setStartMonth] = useState(months[0].start.slice(0, 7))
  const [label, setLabel] = useState(months[0].label || months[0].dateRange)

  const [start, setStart] = useState(result[0].start.slice(0, 7))
  const [monthLabel, setMonthLabel] = useState(result[0].dateRange)

  const [activeTab, setActiveTab] = useState("income")
  const tabs = [
    { id: "income", title: "Income"},
    { id: "expense", title: "Expense"}
  ]

  const categoryColor = {

    salary: "#86198f",
    freelance: "#3b0764" ,
    business: "#0891b2" ,
    investments: "#9333ea" ,
    gift: "#172554" ,
    rentals: "#f43f5e",
    others: "#881337",
    transport: "#0d9488",
    food: "#a16207",
    utilities: "#4c0519",
    health: "#ec4899",
    housing: "#365314",
    shopping: "#0891b2",
    entertainment: "#e11d48",

  }


  console.log("categoryData", categoryData)
  
  const incomeChart = incomeData.map((data) =>{

    return{
      value: data.amountSpent, 
      text: `${Math.round(data.percentageOfIncome)}% `,
      color: categoryColor[data.incomeCategory]
    }
    
     
  
    
  })

  const expenseChart = expenseData.map((data) =>{

    return{
      value: data.amountSpent, 
      text: `${Math.round(data.percentageOfExpenses)}% `,
      color: categoryColor[data.expensesCategory]
    }
    
  })

 // console.log("incomeChart", incomeChart)

  const handleSelect = (item) =>{

    setLabel(item.dateRange)
    setStartMonth(item.start.slice(0, 7))
    setIsDrop(!isDrop)
    

  }



  const handleSelectMonth = (item) =>{

    setMonthLabel(item.dateRange)
    setStart(item.start.slice(0, 7))
    setIsDropB(!isDropB)
    

  }

 
  const chartData = data.flatMap((item, i) => [
    { value: item.income, label: item.period.split(' ')[0], frontColor: "#16a34a", spacing: 2, labelWidth: 30, },
    { value: item.expense, frontColor: "#dc2626", },
  ])

  const getTabColor = (id) =>{
    if(activeTab === id){
      if(id === "income") return "bg-green-600"
      if(id === "expense") return "bg-red-600"
    }

    return "bg-gray-400"

  }

  





  useEffect(() => {

    
    
    const fetchAnalyticOverview = async() =>{
      const res = await axios.post('/transaction/analytics', { startMonth })

      setData(res.data)


    }

    fetchAnalyticOverview()


  },[startMonth])

  useEffect(() => {
    
    const fetchAnalyticsCategory = async() =>{
      const res = await axios.post('/transaction/analytics/category', { startMonth: start })

      //console.log("response", res.data)

      setIncomeData(res.data.incomeSummary)
      setExpenseData(res.data.expensesSummary)


    }

    fetchAnalyticsCategory()


  },[start])

  useEffect(() =>{

    const fetchCategory = async() =>{
      if(category){
        const res = await axios.post('/transaction/category', { category })
        

        setCategoryData(res.data)
      }
    


    }

    fetchCategory()


  }, [category])
 
  return (
    <View className="flex-1 flex-col p-5">

      <View className=" mb-5">
        <TouchableOpacity className="" onPress={() => router.push('/(tabs)/home') }>
          <Ionicons name='arrow-back' size={20} />
        </TouchableOpacity>

        <Text className="font-outfit-medium text-3xl text-center capitalize">Analytics</Text>

      </View>

      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
    

      >

        <View className="flex w-full mt-3 pb-10 flex-col">
          <View className="relative flex flex-row px-4 items-center justify-between">
            <Text className="font-outfit-semibold text-xl">Overview</Text>
            <TouchableOpacity className="flex flex-row gap-3 items-center justify-center border-2 border-fuchsia-900 p-2 rounded-lg" onPress={() => setIsDrop(!isDrop)}>
              <Text className="font-outfit-medium text-md" >{label}</Text>
              <Ionicons name='chevron-up' className={`${isDrop ? "flex" : "hidden"}`}/>
              <Ionicons name='chevron-down' className={`${isDrop ? "hidden" : "flex"}`}/>
            </TouchableOpacity>

            <View className ={`${isDrop ? "flex" : "hidden"} absolute flex-col items-left justify-center p-2 top-12 shadow-md right-2 w-[150px] bg-white z-20 h-[150px]`}>

              {months.map((item) => (
                <TouchableOpacity key={item.start} onPress={() =>handleSelect(item)}>
                  <Text className="text-xl ml-3 mb-2  ">{item.label || item.dateRange}</Text>
                </TouchableOpacity>
              ))}



            </View>
          </View>

          <View className="mt-5 bg-fuchsia-800 rounded-lg py-5 px-2 flex flex-col items-center justify-center">
            <View className="flex mt-5 ml-3 mb-2 gap-9 flex-row">
              <View className="flex flex-row">
                <View className="bg-green-600 w-4 h-4 p-2 mr-2"></View>
                <Text className="font-outfit-medium text-white">Income</Text>
              </View>

              <View className="flex flex-row">
                <View className="bg-red-600 w-4 h-4  p-2 mr-3"></View>
                <Text className="font-outfit-medium text-white">Expenses</Text>
              </View>

            </View>
            <BarChart

              data={chartData}
              barWidth={10}
              spacing={20}
              hideRules
              stepValue={20000}
              initialSpacing={2}
              barMarginBottom={2}
              yAxisTextStyle={{ color: 'white', fontSize: 10, fontFamily: 'OutfitBold' }}
              xAxisLabelTextStyle={{ color: 'white', fontSize: 10, fontFamily: 'OutfitBold' }}
              noOfSections={5}
              
              
              
            

            />

            
          </View>

          
        </View>

        <View className="flex w-full mt-8 flex-col">
          <Text className="text-2xl font-outfit-bold mb-3">Category</Text>

          <View className=" flex items-center bg-gray-400 w-[175px] self-center rounded-full justify-center flex-row">
            {tabs.map((tab) => (
              <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)}>
                <Text className={`font-outfit-medium px-5 py-2 rounded-full text-xl text-white ${getTabColor(tab.id)}`}>{tab.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {
            activeTab === "income" &&
            <View className="flex flex-col mt-5 pb-[10rem]">
              
              <View className="flex flex-row items-center justify-between relative">
                <Text className="font-outfit-semibold text-2xl">Your Income Category</Text>
                <TouchableOpacity className="  flex flex-row gap-1 px-2 py-1 items-center justify-center border-2 border-fuchsia-800  rounded-lg" onPress={() => setIsDropB(!isDropB)}>
                  <Text className="text-xl font-outfit-bold ">{monthLabel}</Text>
                  <Ionicons name='chevron-up' className={`${isDropB ? "flex" : "hidden"}`}/>
                  <Ionicons name='chevron-down' className={`${isDropB ? "hidden" : "flex"}`}/>
                </TouchableOpacity>

            
    
                <View className ={`${isDropB ? "flex" : "hidden"} absolute flex-col items-left justify-center p-2 z-20 top-12 shadow-md right-2 w-[150px] bg-white h-[180px]`}>
                  
    
                  {result.map((item) => (
                    <TouchableOpacity key={item.start} onPress={() =>handleSelectMonth(item)}>
                      <Text className="text-xl ml-3 mb-2 ">{item.dateRange}</Text>
                    </TouchableOpacity>
                  ))}
    
    
    
                </View>
                
              </View>

              {
                incomeData.length === 0 && 
                <View className="flex items-center justify-center mt-6">
                  <Text className="capitalize text-2xl font-outfit-semibold">No data found</Text>
                </View>
              }

              {
                incomeChart.length > 0 &&

                <View className=" mt-5 flex flex-col items-center justify-center">
                  <PieChart

                    data={incomeChart}
                    showText
                    textBackgroundRadius={20}
                    textColor='black'
                    textSize={15}
                    showTextBackground
                    donut
                    centerLabelComponent={() => {
                      return(
                        <View className="flex flex-col items-center justify-center">
                          <Text className="text-xl font-outfit-semibold text-black">
                            {incomeData[0].totalIncome.toLocaleString()}</Text>
                          <Text className="text-sm font-outfit-medium text-black">Total Income</Text>
                        </View>
                      )
                    }}
                    

                  />


                  <View className="mt-4 flex flex-row flex-wrap gap-3">
                    {
                      incomeData.map((data) =>(
                        <View key={data.incomeCategory} className="flex flex-row gap-1 items-center justify-center">
                          <View style={{ backgroundColor: `${categoryColor[data.incomeCategory]}`}} className={`rounded-full w-4 h-4 `}></View>
                          <Text className="font-outfit-medium text-lg capitalize">{data.incomeCategory}</Text>


                        </View>

                      ))
                    }
                  </View>

                  <View className="mt-6 flex flex-col self-start ml-3 gap-3">
                    <Text className="font-outfit-medium text-xl  mt-4 mb-3">Percentage of income</Text>

                    <View className="flex flex-row flex-wrap gap-2 ">
                      

                      {
                      incomeData.length > 0 && incomeData.map((data) =>(
                        <TouchableOpacity key={data.incomeCategory} onPress={() => setCategory(data.incomeCategory)}>
                          <PieChart

                            
                            data={[
                              {
                                value: data.percentageOfIncome,
                                color: categoryColor[data.incomeCategory]

                              },

                              {
                                value: 100 - data.percentageOfIncome,
                                color: '#d3d3d3'
                              }
                            ]}
                            donut
                            radius={50}
                            innerRadius={40}

                            centerLabelComponent={() => {
                              return(
                                <View className="flex flex-col items-center justify-center">
                                  <Text className="text-xl font-outfit-semibold text-black">
                                    {Math.round(data.percentageOfIncome)}%</Text>
                                  <Text className="text-sm font-outfit-medium text-black">{data.incomeCategory}</Text>
                                </View>
                              )
                            }}

                          />
                        </TouchableOpacity>

                        
                        

                        ))
                      }
                      
                    </View>

                  </View>

                </View>

                

              }



              
            </View>
          }

          {
            activeTab === "expense" &&
            <View  className="flex flex-col mt-5">
              <View className="flex flex-row items-center justify-between relative">
                <Text className="font-outfit-semibold text-2xl">Your Spending Category</Text>
                <TouchableOpacity className="  flex flex-row gap-1 px-2 py-1 items-center justify-center border-2 border-fuchsia-800  rounded-lg" onPress={() => setIsDropB(!isDropB)}>
                  <Text className="text-xl font-outfit-bold ">{monthLabel}</Text>
                  <Ionicons name='chevron-up' className={`${isDropB ? "flex" : "hidden"}`}/>
                  <Ionicons name='chevron-down' className={`${isDropB ? "hidden" : "flex"}`}/>
                </TouchableOpacity>
    
                <View className ={`${isDropB ? "flex" : "hidden"} absolute flex-col items-left justify-center p-2 top-12 shadow-md right-2 w-[150px] bg-white z-20 h-[180px]`}>
    
                  {result.map((item) => (
                    <TouchableOpacity key={item.start} onPress={() =>handleSelectMonth(item)}>
                      <Text className="text-xl ml-3 mb-2 ">{item.dateRange}</Text>
                    </TouchableOpacity>
                  ))}
    
    
    
                </View>
              </View>

              {
                expenseData.length === 0 && 
                <View className="flex items-center justify-center mt-6">
                  <Text className="capitalize text-2xl font-outfit-semibold">No data found</Text>
                </View>
              }

              {
                expenseChart.length > 0 &&

                <View className=" mt-5 flex flex-col items-center justify-center">
                  <PieChart

                    data={expenseChart}
                    showText
                    textBackgroundRadius={20}
                    textColor='black'
                    textSize={15}
                    showTextBackground
                    donut
                    centerLabelComponent={() => {
                      return(
                        <View className="flex flex-col items-center justify-center">
                          <Text className="text-xl font-outfit-semibold text-black">
                            {expenseData[0].totalExpense.toLocaleString()}</Text>
                          <Text className="text-sm font-outfit-medium text-black">Total Expenses</Text>
                        </View>
                      )
                    }}
                    

                  />


                  <View className="mt-4 flex flex-row flex-wrap gap-3">
                    {
                      expenseData.map((data) =>(
                        <View key={data.expensesCategory} className="flex flex-row gap-1 items-center justify-center">
                          <View style={{ backgroundColor: `${categoryColor[data.expensesCategory]}`}} className={`rounded-full w-4 h-4 `}></View>
                          <Text className="font-outfit-medium text-lg ">{data.expensesCategory}</Text>


                        </View>

                      ))
                    }
                  </View>

                  <View className="mt-6 flex flex-col self-start ml-3 gap-3">
                    <Text className="font-outfit-medium text-xl  mt-4 mb-3">Percentage of income</Text>

                    <View className="flex flex-row flex-wrap gap-2 ">
                      

                      {
                      expenseData.length > 0 && expenseData.map((data) =>(
                        <TouchableOpacity key={data.expensesCategory} onPress={() => setCategory(data.expensesCategory)}>
                          <PieChart

                            key={data.expensesCategory}
                            data={[
                              {
                                value: data.percentageOfIncome,
                                color: categoryColor[data.expensesCategory]

                              },

                              {
                                value: 100 - data.percentageOfIncome,
                                color: '#d3d3d3'
                              }
                            ]}
                            donut
                            radius={50}
                            innerRadius={40}

                            centerLabelComponent={() => {
                              return(
                                <View className="flex flex-col items-center justify-center">
                                  <Text className="text-xl font-outfit-semibold text-black">
                                    {Math.round(data.percentageOfIncome)}%</Text>
                                  <Text className="text-sm font-outfit-medium text-black">{data.expensesCategory}</Text>
                                </View>
                              )
                            }}

                          />
                        </TouchableOpacity>

                        
                        

                        ))
                      }
                      
                    </View>

                  </View>

                </View>

                

              }


            </View>
          }

          {
            categoryData &&
            <View className="mt-5 flex  flex-col px-3 gap-3 items-center justify-center">

            

              {categoryData.map((item) => (
                <View key={item._id} className="bg-gray-100 p-2 mb-3 shadow-lg flex flex-row items-center justify-between w-full">
    
                  <View className="flex flex-row gap-3 items-center">
                    <View className="bg-fuchsia-900 p-2 rounded-full">
    
                      <Font name={`${fontCat.find(cat => cat.id === item.category)?.name || ""}`} />
                      
                    </View>
    
                    <View className="flex flex-col">
                      <Text className="text-xl capitalize font-outfit-semibold">{item?.title}</Text>
                      <Text className="text-gray-500 text-sm  font-outfit capitalize">{item?.category}</Text>
                    </View>
                  </View>
                  
                  <View className="flex flex-col gap-1 justify-center" >
                    <View className="flex flex-row gap-3">
                      <Text className={` text-xl font-outfit-medium ${item?.type === "expense" ? "text-red-600" : "text-green-600"}`}>&#8358;  {item?.amount.toLocaleString()}</Text>
    
                      <TouchableOpacity>
                        <Ionicons name='trash' size={20} color={`${item?.type === "expense" ? "#dc2626" : "#16a34a"}`}/>
                      </TouchableOpacity>
                    </View>
    
                    <Text className="font-outfit text-gray-500 text-sm">{item?.date?.split("T")[0]}</Text>
                    
                  </View>
                  
                  
                </View>
              ))}

            </View>
          }


        </View>

      </ScrollView>
      
      
    </View>
  )
}

export default analytics

const Font = ({ name }) =>(
  <Ionicons name={name} size={15} color={'#fff'} />
)
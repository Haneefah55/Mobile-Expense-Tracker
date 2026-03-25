import { View, Text } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-gifted-charts'

const ExpenseChart = ({ expenseData }) => {
  const data = expenseData.map((item) => {

    return {
      value: item.expense,
      label: item.day
    }
  })

  const maxY = Math.max(...data.map(item => item.value))

  const chartMax =maxY + maxY * 0.1

 /*  const data = [
    { value: 50, label: "Sun" },
    { value: 30, label: "Mon" },
    { value: 20, label: "Tue" },
    { value: 60, label: "Wed" },
    { value: 150, label: "Thur" },
    { value: 100, label: "Fri" },
    { value: 80, label: "Sat" },
  ] */

  return (
  
      

    <View className="mt-3 h-[250px] flex items-center justify-center">
      <LineChart
        data={data}
        curved
        thickness={3}
        
        color="#000" // blue-600
        hideDataPoints={false}
        dataPointsColor="#86198f"
        dataPointsRadius={5}
        startFillColor="#86198f"
        endFillColor="#d946ef"
        startOpacity={0.6}
        endOpacity={0.01}
        spacing={45}
        yAxisColor="transparent"
        xAxisColor="transparent"
        yAxisTextStyle={{ color: '#86198f', fontSize: 10, fontFamily: 'OutfitBold' }}
        xAxisLabelTextStyle={{ color: '#86198f', fontSize: 10, fontFamily: 'OutfitBold' }}
        rulesType="solid"
        rulesColor="rgba(0,0,0,0.1)"
        noOfSections={4}
        maxValue={chartMax}
        areaChart
        initialSpacing={3}
        stepValue={1000}



      />
    </View>

      
    
  )
}

export default ExpenseChart
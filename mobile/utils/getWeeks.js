

export const  getPreviousWeeks =() => {
  const numWeeks = 5
  const now = new Date()
  const currentDay = now.getDay()

  const currentWeekStarts = new Date(now)

  currentWeekStarts.setDate(now.getDate() - currentDay)

  const weeks=[]

  
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  

   for(let i = numWeeks - 1; i >= 0; i--) {
    const start = new Date(currentWeekStarts)
    
    start.setDate(currentWeekStarts.getDate() - i * 7 )
    //console.log("start", start)
    
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    //console.log("end", end)
    const label = i === 0 ? "This Week" : i === 1 ? "Last Week" : "";

    const startLabel = `${month[start.getMonth()]} ${String(start.getDate()).padStart(2, "0")}`
    const endLabel = `${month[end.getMonth()]} ${String(end.getDate()).padStart(2, "0")}`

    const dateRange = `${startLabel} - ${endLabel}`

    weeks.push({
      label,
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
      dateRange,
    }) 


  } 

  return weeks.reverse()

}

export const getPreviousMonths =() =>{
  const now = new Date()


  const months=[]

  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


  

  for(let i = 0 ; i < 4; i++) {
    const end = new Date(now.getFullYear(), now.getMonth() - (i * 6) + 2, 0, 23, 59, 59, 999)
    const start = new Date(end.getFullYear(), end.getMonth() - 4, 1, 0, 0, 0, 0)



    const label = i === 0 ? "Last 6 months" : "";

    const startLabel = `${month[start.getMonth() - 1]} ${String(start.getFullYear())}`
    const endLabel = `${month[end.getMonth()]} ${String(end.getFullYear())}`

    const dateRange = `${startLabel} - ${endLabel}` 

    //console.log("dateRange", dateRange) 

    months.push({
      label,
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
      dateRange,
    }) 
  }   

  return months
}

export const getMonths =() =>{
  const now = new Date()


  const months=[]

  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


  
  const num = 5
  for(let i = num - 1; i >= 0; i--) {

    const start = new Date(now.getFullYear(), now.getMonth() - (i - 1) , 0) // 10 - 5 = 5
    //const end = new Date(start.getFullYear(), start.getMonth() - 1, 1)



    //const label = i === 0 ? "This Months" : "";
    const label = i === 0 ? "This Month" : i === 1 ? "Last Month" : "";
    const startLabel = `${month[start.getMonth()]} ${String(start.getFullYear())}`
    //const endLabel = `${month[end.getMonth()]} ${String(end.getFullYear())}`

    const dateRange = `${label}` || `${startLabel}`

    //console.log("dateRange", dateRange) 

    months.push({
      label,
      start: start.toISOString().split("T")[0],
      //end: end.toISOString().split("T")[0],
      dateRange,
    }) 
  }   

  return months.reverse()
}



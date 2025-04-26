// mock-chart.js - A simple mock for chart drawing functions
// In a real application, you would use a real chart library like wx-charts or echart-for-weixin

export function drawLineChart(canvasId, data) {
  // In a real application, this would actually draw a chart
  // For now, we just log to console that the chart would be drawn
  console.log(`Drawing line chart on canvas #${canvasId} with data:`, data)
  
  // This would actually create and return a chart instance in a real app
  return {
    canvasId: canvasId,
    data: data,
    // Mock methods that a real chart library would have
    updateData: (newData) => {
      console.log(`Updating chart #${canvasId} with new data:`, newData)
    },
    stopAnimation: () => {
      console.log(`Stopping animation for chart #${canvasId}`)
    }
  }
}

export function drawBarChart(canvasId, data) {
  console.log(`Drawing bar chart on canvas #${canvasId} with data:`, data)
  
  return {
    canvasId: canvasId,
    data: data,
    updateData: (newData) => {
      console.log(`Updating chart #${canvasId} with new data:`, newData)
    },
    stopAnimation: () => {
      console.log(`Stopping animation for chart #${canvasId}`)
    }
  }
}

export function drawPieChart(canvasId, data) {
  console.log(`Drawing pie chart on canvas #${canvasId} with data:`, data)
  
  return {
    canvasId: canvasId,
    data: data,
    updateData: (newData) => {
      console.log(`Updating chart #${canvasId} with new data:`, newData)
    },
    stopAnimation: () => {
      console.log(`Stopping animation for chart #${canvasId}`)
    }
  }
}

// Helper function to format data for trend charts
export function formatTrendData(rawData) {
  // This would transform backend data into a format suitable for charts
  return {
    categories: rawData.dates || [],
    series: [
      {
        name: '热度指数',
        data: rawData.values || []
      }
    ]
  }
}

// Helper function to generate random mock data for demos
export function generateMockTrendData(days = 7) {
  const categories = []
  const values = []
  
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    categories.push(`${date.getMonth() + 1}/${date.getDate()}`)
    values.push(Math.floor(Math.random() * 50) + 50) // Random value between 50-100
  }
  
  return {
    categories,
    series: [
      {
        name: '热度',
        data: values
      }
    ]
  }
} 
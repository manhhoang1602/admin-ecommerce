import React from 'react'
import { Bar } from 'react-chartjs-2'

interface IBarChartConfig {
  label: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  barPercentage?: number
  barThickness?: number
  data: number[]
}

interface IDataBarChart {
  labels: string[]
  datasets: IBarChartConfig[]
}

interface IProps {
  data: IDataBarChart
  height?: number
  width?: number
  type: 'Horizontal' | 'Vertical'
}

export const dataBarChart: IDataBarChart = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: '#EC932F',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      label: 'My First dataset 2',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      barThickness: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
}

const BarChart: React.FC<IProps> = ({ data, type, height, width }) => {
  return (
    <Bar
      data={data}
      height={height}
      width={width}
      options={{
        indexAxis: type === 'Horizontal' ? 'y' : 'x',
        plugins: {
          title: {
            font: { size: 12, family: 'rubik' },
          },
          legend: { display: false, position: 'right' },
        },
        maintainAspectRatio: false,
      }}
    />
  )
}

export default BarChart

import React from 'react'
import { Line } from 'react-chartjs-2'

export interface ILineConfig {
  label: string
  fill: boolean
  lineTension: number
  backgroundColor: string
  borderColor: string
  borderWidth: number
  data: number[]
}

export interface IDataChartLine {
  labels: string[]
  datasets: ILineConfig[]
}

interface IProps {
  data: IDataChartLine
  height?: number
  width?: number
}

export const dataLineChart: IDataChartLine = {
  labels: ['T1', 'T2', 'T3'],
  datasets: [
    {
      label: 'line',
      fill: false,
      lineTension: 0.5,
      backgroundColor: 'orange',
      borderColor: 'orange',
      borderWidth: 2,
      data: [1, 2, 1],
    },
  ],
}

const LineChart: React.FC<IProps> = ({ data, height, width }) => {
  return <Line data={data} height={height} width={width} />
}

export default LineChart

import React from 'react'
import { Doughnut, Pie } from 'react-chartjs-2'

interface IConfigChart {
  label: string
  data: number[]
  backgroundColor: string[]
}

interface IDataDoughnutAndPieChart {
  labels: string[]
  datasets: IConfigChart[]
}

interface IProps {
  dataChart: IDataDoughnutAndPieChart
  height?: number | string
  width?: number | string
  type?: 'DOUGHNUT' | 'PIE'
}
export const dataDoughnutAndPie: IDataDoughnutAndPieChart = {
  labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [10, 56, 47, 12, 52],
      backgroundColor: ['red', 'black', 'green', 'orange', 'gray'],
    },
  ],
}

const DoughnutPieChart: React.FC<IProps> = ({ dataChart, type, width, height }) => {
  return (
    <>
      {type === 'DOUGHNUT' ? (
        <Doughnut data={dataChart as IDataDoughnutAndPieChart} height={height} width={width} />
      ) : (
        <Pie data={dataChart as IDataDoughnutAndPieChart} height={height} width={width} />
      )}
    </>
  )
}

export default DoughnutPieChart

import React, { CSSProperties } from 'react'
import { Button } from 'antd'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

interface IProps {
  sheetName: string[]
  sheets: { [key: string]: any }
  fileName: string
  onClick?: (fn: Function) => any
  loading?: boolean
  style?: CSSProperties
}

export const getSheets = (data: any[]): any => {
  return XLSX.utils.json_to_sheet(data)
}

export const dataExport = [{ col1: 'value1', col2: 'value2' }]

const ExportCsv: React.FC<IProps> = ({ fileName, sheetName, sheets, onClick, style, loading, children }) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSV = async () => {
    const wb = {
      Sheets: sheets,
      SheetNames: sheetName,
    }

    const excelBuffer = XLSX.write(wb as any, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  return (
    <Button
      type={'primary'}
      loading={loading}
      style={style}
      onClick={() => (onClick ? onClick(exportToCSV) : exportToCSV())}
    >
      {children}
    </Button>
  )
}

export default ExportCsv

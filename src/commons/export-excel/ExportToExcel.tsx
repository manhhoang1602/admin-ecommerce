import React, { useEffect } from 'react'
import * as ExcelJs from 'exceljs'

interface IProps {
  fileName: string
  dataExport: { [key: string]: any }[]
  header: any[]
  button: React.ReactNode
  onExport?: (fn: Function) => any
}

const ExportToExcel = (props: IProps) => {
  const { fileName, dataExport, header, button, onExport } = props

  const exportToExcel = (data: any[], header: any[]) => {
    let sheetName = `${fileName}.xlsx`
    let headerName = 'RequestsList'

    let workbook = new ExcelJs.Workbook()
    let sheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: true }],
    })

    sheet.addRow(header)

    let columnArr = []
    for (let i in data[0]) {
      let tempObj = { name: '' }
      tempObj.name = i
      columnArr.push(tempObj)
    }

    sheet.addTable({
      name: headerName,
      ref: 'A2',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleLight9',
        showRowStripes: false,
      },
      columns: columnArr ? columnArr : [{ name: '' }],

      rows: data.map((e) => {
        let arr = []
        for (let i in e) {
          arr.push(e[i])
        }
        return arr
      }),
    })

    sheet.columns = sheet.columns.map((e: any) => {
      return { width: 20 }
    })

    const writeFile = (fileName: any, content: any) => {
      const link = document.createElement('a')
      const blob = new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8;',
      })
      link.download = fileName
      link.href = URL.createObjectURL(blob)
      link.click()
    }

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      writeFile(sheetName, buffer)
    })
  }

  useEffect(() => {
    onExport && onExport(exportToExcel)
  }, [])

  return (
    <span
      onClick={() => {
        !onExport && exportToExcel(dataExport, header)
      }}
    >
      {button}
    </span>
  )
}

export default ExportToExcel

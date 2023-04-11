import React, { Children, cloneElement } from 'react'
import moment from 'moment'

interface IProps {
  format?: string | 'DD-MM-YYYY'
  disableDate?: 'FEATURE' | 'AGO'
  onChange?: (stringDate: [string, string]) => any
}

export const disableDateAgo = (current: any) => {
  return current && current < moment().startOf('date')
}

const RangePickerHoc: React.FC<IProps> = ({
  children,
  onChange,
  format = ['DD-MM-YYYY', 'DD-MM-YYYY'],
  disableDate,
}) => {
  const getDisableDate = (current: any) => {
    if (disableDate === 'FEATURE') {
      return current && current >= moment().endOf('date')
    }
    if (disableDate === 'AGO') {
      return current && current < moment().startOf('date')
    }
    return undefined
  }
  return (
    <>
      {Children.map(children, (child: any) => {
        // console.log(child);
        const props = {
          disabledDate: (current: any) => getDisableDate(current),
          suffixIcon: <i className="fal fa-calendar-alt" />,
          inputReadOnly: true,
          placeholder: child.props.placeholder || ['Từ ngày', 'Đến ngày'],
          onChange: (date: any, stringDate: [string, string]) => {
            onChange &&
              onChange([
                stringDate[0] ? moment(stringDate[0], 'DD-MM-YYYY').toISOString() : '',
                stringDate[1] ? moment(stringDate[1], 'DD-MM-YYYY').add(1, 'days').toISOString() : '',
              ])
          },

          format: child.props.format || format,
        }
        return cloneElement(child, props)
      })}
    </>
  )
}

export default RangePickerHoc

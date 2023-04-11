import moment from 'moment'

export interface IInputSplitArray {
  newArray: { [key: string]: any }[]
  mergeArray: { [key: string]: any }[]
  deleteArray: { [key: string]: any }[]
}

export const splitArray = (
  inputArray: { [key: string]: any }[],
  defaultArray: { [key: string]: any }[],
  key: string,
  getValueMerge: 'inputArray' | 'defaultArray' = 'inputArray'
): IInputSplitArray => {
  const result: IInputSplitArray = {
    newArray: [],
    mergeArray: [],
    deleteArray: [],
  }

  const newArray = inputArray.filter((itemInputArr) => {
    return !defaultArray.find((itemDefaultArr) => itemDefaultArr[key] === itemInputArr[key])
  })

  const mergeArrayInput = inputArray.filter((itemInputArr) => {
    return defaultArray.find((itemDefaultArr) => itemDefaultArr[key] === itemInputArr[key])
  })

  const mergeArrayDefault = defaultArray.filter((itemDefaultArr) => {
    return inputArray.find((itemInputArr) => itemDefaultArr[key] === itemInputArr[key])
  })

  const deleteArray = defaultArray.filter((itemDefaultArr) => {
    return !mergeArrayInput.find((mergeArray) => itemDefaultArr[key] === mergeArray[key])
  })

  result.newArray = newArray
  result.mergeArray = getValueMerge === 'inputArray' ? mergeArrayInput : mergeArrayDefault
  result.deleteArray = deleteArray
  return result
}

export const isFuture = (time?: string): boolean => {
  if (moment() < moment(time)) {
    return true
  } else {
    return false
  }
}

import moment from 'moment'

export class Moment {
  static getDate(
    _date: number | string | undefined,
    _format:
      | string
      | 'DD/MM/YYYY'
      | 'DD-MM-YYYY'
      | 'hh:mm DD/MM/YYYY'
      | 'HH:mm DD/MM/YYYY'
      | 'hh:mm A DD/MM/YYYY'
      | 'HH:mm'
      | 'HH:mm:ss'
      | 'YYYY-MM-DD'
      | 'toISOString'
  ): string {
    return _format ? moment(_date).format(_format) : '___'
  }

  static getDateIncrementOrDecrement(
    _type: 'INCREMENT' | 'DECREMENT',
    _date: string | number,
    _numDay: number
  ): number {
    const date = new Date(_date)
    if (_type === 'INCREMENT') {
      date.setDate(date.getDate() + _numDay)
    } else {
      date.setDate(date.getDate() - _numDay)
    }
    return date.getTime()
  }

  static msToHMS(ms: number): string {
    let seconds: number = ms / 1000
    let hours: number = parseInt((seconds / 3600).toString())
    seconds = seconds % 3600
    let minutes = parseInt((seconds / 60).toString())
    seconds = Math.round(seconds % 60)
    return hours + ':' + minutes + ':' + seconds
  }

  static getHMS(ms: number): { M: number; S: number; H: number } {
    let seconds: number = ms / 1000
    let minutes = seconds / 60
    let hours = seconds / 60
    seconds = Math.round(seconds % 60)

    return {
      H: hours,
      M: minutes,
      S: seconds,
    }
  }

  static MToMs(minutes: number): number {
    return minutes * 60 * 1000
  }

  public static getPeriod(
    startTime: number | string,
    endTime: number | string,
    type: 'hour' | 'minute' | 'second'
  ): number {
    let rs: number = 0
    let ss: number = moment(endTime).unix() - moment(startTime).unix()

    if (type === 'hour') {
      return ss / 3600
    } else if (type === 'minute') {
      return ss / 60
    } else if (type === 'second') {
      return ss
    }

    return rs
  }
}

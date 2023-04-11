export class Format {
  public static numberWithCommas(_x: any, _currency?: string, _isReturnZero: boolean = true): string {
    if (_x) {
      _x = _x.toString().replace(/[,]/g, '')
      var pattern = /(-?\d+)(\d{3})/
      while (pattern.test(_x)) {
        _x = _x.replace(pattern, '$1,$2')
      }
      return `${_x}${_currency ? ' ' + _currency : ''}`
    } else {
      if (_isReturnZero) {
        return `0 ${_currency ? _currency : ''}`
      } else return ''
    }
  }

  public static slug(_value: string) {
    const alphabet = (str: string) => {
      str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a')
      str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e')
      str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i')
      str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o')
      str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u')
      str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y')
      str = str.replace(/(đ)/g, 'd')
      return str
    }

    // Chuyển hết sang kí tự thường
    _value = _value.toLocaleLowerCase()
    // Xóa dấu tiếng việt
    _value = alphabet(_value)
    // Xóa kí tự đặc biệt
    _value = _value.replace(/([^0-9a-z-\s])/g, '')
    // Xóa khoảng trắng
    _value = _value.replace(/\s+/g, '-')
    // Xóa kí tự - đầu dòng
    _value = _value.replace(/^-+/g, '')
    // Xóa kí tự - cuối dòng
    _value = _value.replace(/-+$/g, '')

    return _value
  }

  public static formatString(_value: string | undefined | null, _isDisplay?: boolean, prefix?: string): string {
    if (_value) {
      return (prefix ? prefix + ' ' : '') + _value
    } else {
      if (_isDisplay) {
        return ''
      } else {
        return '_ _ _'
      }
    }
  }
}

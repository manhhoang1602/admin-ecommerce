import { BASE_URL } from './Basevices'

class Config {
  public static _limit: number = 12
  public static _offsetTopAffix: number = 42

  public static _minDurationVideo: number = 10
  public static _maxDurationVideo: number = 60

  public static _statusSuccessCallAPI: number = 1

  public static _pathUploadImage: string = `${BASE_URL}/media/uploadMedia/1`
  public static _pathUploadVideo: string = `${BASE_URL}/media/uploadMedia/2`

  public static _nameUploadUImage: string = 'image'
  public static _nameUploadVideo: string = 'video'

  public static _sizeUploadImage: number = 7
  public static _sizeUploadVideo: number = 7

  public static _timeOutGetData: number = 500

  public static _typeMedia = {
    IMAGE: 1,
    VIDEO: 2,
  }

  public static _reg = {
    pass: /^[a-zA-Z0-9!@#$%^&*]*$/,
    phone: /^((09|03|07|08|05|1)+([0-9]{6,9}))$/,
    number: /^[0-9]+$/,
    name: /^[\S][\s\S]{0,50}$/,
    username:
      /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9]{0,50}$/,
    code: /^[a-zA-Z0-9]*$/,
    nameUnicode:
      /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9-]*$/,
    nameUnicode150:
      /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9-]{0,150}$/,
    nameUnicode50:
      /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9-]{0,50}$/,
    nameUnicode200:
      /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9-\s\S]{0,200}$/,
    price: /^[0-9]+$/,
    emailNumber: /^[0-9]*@[a-z]*\.[a-z]{0,3}$/,
  }

  public static getIndexTable(_page: number, _index: number, _limit?: number) {
    let limit: number = _limit ? _limit : Config._limit
    return _page * limit - limit + (_index + 1)
  }

  public static replaceWhiteSpace(_value: string): string {
    return _value.replace(/\s/g, '')
  }

  public static parserFormatNumber(_value: string): number | null {
    if (!_value) {
      return null
    }
    _value = _value.replace(/,/g, '')
    return Number(_value)
  }
}

export default Config

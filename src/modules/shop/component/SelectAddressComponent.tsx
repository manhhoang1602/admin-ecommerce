import React, { useEffect, useState } from 'react'
import { IResDataDistrict, IResDataProvinces } from './SelectAddressInterfaces'
import { Select, FormItemProps, Form } from 'antd'
import { getDistrictApi, getProvincesApi, getWardApi } from './SelectAddressApi'
import { Baservices, IApiResponse } from '../../../services/Basevices'

export const SelectProvincesComponent = (props: {
  value?: number
  onChange: (values: number | undefined | number[]) => any
  type?: 'multiple' | 'tags'
}) => {
  const { value, onChange } = props

  const [loading, setLoading] = useState<boolean>(false)
  const [listProvince, setListProvince] = useState<IResDataProvinces[]>([])

  const [values, setValues] = useState<number | undefined>(undefined)

  const getListProvince = async () => {
    try {
      setLoading(true)
      const res = await getProvincesApi()
      if (res.body.status) {
        setListProvince(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListProvince()
  }, [])

  useEffect(() => {
    setValues(value)
  }, [value])

  return (
    <Select
      placeholder={'Tỉnh thành phố'}
      loading={loading}
      value={values}
      mode={props.type}
      onChange={(value1) => {
        setValues(value1)
        onChange(value1)
      }}
    >
      {listProvince.map((value) => {
        return (
          <Select.Option value={value.id} key={value.id}>
            {value.name}
          </Select.Option>
        )
      })}
    </Select>
  )
}

export const SelectDistrictComponent = (props: {
  value?: number
  onChange: (values: number | undefined) => any
  provinceId: number | undefined
}) => {
  const { value, onChange, provinceId } = props

  const [loading, setLoading] = useState<boolean>(false)
  const [listProvince, setListProvince] = useState<IResDataDistrict[]>([])

  const [values, setValues] = useState<number | undefined>(undefined)

  const getListDistrict = async () => {
    try {
      setLoading(true)
      const res = await getDistrictApi(provinceId as number)
      if (res.body.status) {
        setListProvince(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    provinceId && getListDistrict()
    setValues(undefined)
  }, [provinceId])

  useEffect(() => {
    setValues(value)
  }, [value])

  return (
    <Select
      placeholder={'Quận huyện'}
      loading={loading}
      value={values}
      disabled={!provinceId}
      onChange={(value1, option) => {
        setValues(value1)
        onChange(value1)
      }}
    >
      {listProvince.map((value) => {
        return (
          <Select.Option value={value.id} key={JSON.stringify({ id: value.id, provinceId: value.provinceId })}>
            {value.name}
          </Select.Option>
        )
      })}
    </Select>
  )
}

export const SelectWardComponent = (props: {
  value?: number
  onChange: (values: number | undefined) => any
  districtId: number | undefined
}) => {
  const { value, onChange, districtId } = props

  const [loading, setLoading] = useState<boolean>(false)
  const [listWard, setListWard] = useState<IResDataDistrict[]>([])

  const [values, setValues] = useState<number | undefined>(undefined)

  const getListWard = async () => {
    try {
      setLoading(true)
      const res = await getWardApi(districtId as number)
      if (res.body.status) {
        setListWard(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    districtId && getListWard()
    setValues(undefined)
  }, [districtId])

  useEffect(() => {
    setValues(value)
  }, [value])

  return (
    <Select
      placeholder={'Phường xã'}
      loading={loading}
      disabled={!districtId}
      value={values}
      onChange={(value1) => {
        setValues(value1)
        onChange(value1)
      }}
    >
      {listWard.map((value) => {
        return (
          <Select.Option value={value.id} key={value.id}>
            {value.name}
          </Select.Option>
        )
      })}
    </Select>
  )
}

// GOOD API

interface IPropsSelectGoogleAddress extends FormItemProps {
  placeholder?: string
  onChange?: (id: string | undefined, description: string, lat: number, long: number) => any
}

const key: string = 'nZ0hX4qVJHIKFkb3zcJMH3zHOaqlnL8qGghlxIve'

const getListPlaceAPI = (input?: string): Promise<IApiResponse<any>> => {
  return Baservices.getMethod(
    `https://rsapi.goong.io/Place/AutoComplete?api_key=${key}&input=${input || 'viet nam ha noi'}&more_compound=true`,
    undefined,
    undefined,
    undefined,
    true
  )
}

const getLapLongAPI = (placeId: string): Promise<IApiResponse<any>> => {
  return Baservices.getMethod(
    `https://rsapi.goong.io/Place/Detail?api_key=${key}&place_id=${placeId}`,
    undefined,
    undefined,
    undefined,
    true
  )
}

export const SelectGoogleAddress: React.FC<IPropsSelectGoogleAddress> = ({ placeholder, onChange, ...rest }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>()
  const [listPlace, setListPlace] = useState<{ placeId: string; description: string }[]>([])

  const getListPlace = async () => {
    try {
      setLoading(true)
      const res = await getListPlaceAPI(search?.trim())
      if (res) {
        setListPlace(res.body.predictions)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const idTimeOut = setTimeout(() => {
      getListPlace()
    }, 500)

    return () => clearTimeout(idTimeOut)
  }, [search])

  return (
    <Form.Item {...rest}>
      <Select
        placeholder={placeholder}
        filterOption={false}
        loading={loading}
        showSearch={true}
        onSearch={(value) => setSearch(value)}
        onChange={async (value, option: any) => {
          const res = await getLapLongAPI(option.key as string)
          if (res) {
            onChange &&
              onChange(
                option.key,
                value as string,
                res.body.result.geometry.location.lat,
                res.body.result.geometry.location.lng
              )
          }
        }}
      >
        {listPlace.map((value) => {
          return (
            <Select.Option key={value.placeId} value={value.description}>
              {value.description}
            </Select.Option>
          )
        })}
      </Select>
    </Form.Item>
  )
}

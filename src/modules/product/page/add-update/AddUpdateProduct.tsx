import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Affix, Button, FormInstance, PageHeader, Spin } from 'antd'
import ProductInfo, { IFormProductInfo } from './component/ProductInfo'
import ProductAttach, { IDatasourceProductAttach } from './component/ProductAttach'
import ProductSize, { IDatasourceAttributeSize } from './component/ProductSize'
import ProductTopping from './component/ProductTopping'
import ProductImage, { IFormImage } from './component/ProductImage'
import Config from '../../../../services/Config'
import { Notification } from '../../../../commons/notification/Notification'
import {
  IReqPostProduct,
  IReqPostProductImage,
  IReqPostProductInfo,
  IReqPutProduct,
  IResDataDetailProduct,
} from '../../ProductInterface'
import { getDetailProductApi, postProductApi, putProductApi } from '../../ProductApi'
import history from '../../../../services/history'
import { ADMIN_ROUTER } from '../../../../router/AdminRouter'
import { IDataSourceTopping } from '../../../config/component/Topping'
import { splitArray } from '../../../../services/Functions'

const DEFINE_TYPE_PRODUCT = {
  ADD: 'add',
  UPDATE: 'update',
}

const AddUpdateProduct = () => {
  const params = new URLSearchParams(window.location.search)
  const type: string = params.get('type') as string
  const id: number = Number(params.get('index'))

  const isAdd: boolean = type === DEFINE_TYPE_PRODUCT.ADD ? true : false
  const [loading, setLoading] = useState({
    submit: false,
    getDetail: false,
  })
  const [detail, setDetail] = useState<IResDataDetailProduct>()
  const [priceInfo, setPriceInfo] = useState<number>(0)

  const formInfoRef = useRef<FormInstance>()
  const formImageRef = useRef<FormInstance>()

  const dataAttributeSize = useRef<IDatasourceAttributeSize[]>([])
  const dataProductAttach = useRef<IDatasourceProductAttach[]>([])
  const dataListTopping = useRef<IDataSourceTopping[]>([])

  const onPost = async () => {
    try {
      setLoading({ ...loading, submit: true })

      await formInfoRef.current!.validateFields()
      await formImageRef.current!.validateFields()

      const valueFormImage: IFormImage = formImageRef.current?.getFieldsValue()
      const valuesFormInfo: IFormProductInfo = formInfoRef.current!.getFieldsValue()

      const reqDataProductInfo: IReqPostProductInfo = {
        name: valuesFormInfo.name,
        category_id: valuesFormInfo.categoryId,
        code: valuesFormInfo.code,
        description: valuesFormInfo.description,
        df_attribute_id: valuesFormInfo.productConfigId,
        display_order: Number(valuesFormInfo.displayOrder),
        price: Number(valuesFormInfo.price),
        unit_id: valuesFormInfo.unitId,
      }

      const imageRequired = valueFormImage.imageRequired.map((value, index) => {
        return {
          type: Config._typeMedia.IMAGE,
          media_url: value.response ? value.response.data.filename : value.name,
          display_order: index,
          is_avatar: 1,
        }
      })

      const images = valueFormImage.images
        ? valueFormImage.images.map((value, index) => {
            return {
              type: Config._typeMedia.IMAGE,
              media_url: value.response ? value.response.data.filename : value.name,
              display_order: index + 1,
              is_avatar: 0,
            }
          })
        : []

      const reqDataProductImage: IReqPostProductImage = {
        product_media: imageRequired.concat(images),
      }

      const validateProductSize = (): { isValidity: boolean; msg: string } => {
        let result = {
          isValidity: true,
          msg: '',
        }

        dataAttributeSize.current.forEach((value) => {
          if (value.status) {
            if (!(value.name.value && value.price.value)) {
              result = {
                isValidity: false,
                msg: 'Vui lòng nhập đầy đủ thuộc tính và giá cộng thêm trong thuộc tính size sản phẩm.',
              }
            }
          }
        })

        const itemDuplicate = dataAttributeSize.current.find((value, index) => {
          let indexDuplicate = dataAttributeSize.current.findIndex((value1) => value1.name.value === value.name.value)
          return indexDuplicate !== index
        })

        if (itemDuplicate) {
          return {
            isValidity: false,
            msg: `Thuộc tính size sản phẩm ${itemDuplicate.name.value} bị trùng.`,
          }
        }

        return result
      }

      const validateImage = (): { isValidity: boolean; msg: string } => {
        if (reqDataProductImage.product_media.length > 6) {
          return {
            isValidity: false,
            msg: 'Vui lòng xóa bớt ảnh tối đa 6 ảnh.',
          }
        }
        return {
          isValidity: true,
          msg: '',
        }
      }

      if (validateProductSize().isValidity && validateImage().isValidity) {
        const reqPostProduct: IReqPostProduct = {
          ...reqDataProductInfo,
          ...reqDataProductImage,
          product_sub_id: dataProductAttach.current.map((value, index) => {
            let productSubId: any = {
              child_product_id: value.id,
              // child_product_size_id: value.productSizeId || null,
              status: value.status,
            }
            return productSubId
          }),
          topping_id: dataListTopping.current.map((value, index) => {
            return {
              topping_id: value.key,
              display_order: index + 1,
              status: value.status,
            }
          }),
          product_size: dataAttributeSize.current.map((value) => {
            return {
              name: value.name.value as string,
              price: Config.parserFormatNumber(String(value.price.value)) as number,
              is_default: value.isDefault.value,
              status: value.status,
            }
          }),
        }

        const res = await postProductApi(reqPostProduct)
        if (res.body.status === Config._statusSuccessCallAPI) {
          Notification.PushNotification('SUCCESS', 'Thêm mới sản phẩm thành công.')
          history.push(ADMIN_ROUTER.PRODUCT_LIST.path)
        }
      } else {
        !validateImage() && Notification.PushNotification('ERROR', validateImage().msg)

        !validateProductSize().isValidity && Notification.PushNotification('ERROR', validateProductSize().msg)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, submit: false })
    }
  }

  const onPut = async () => {
    try {
      setLoading({ ...loading, submit: true })

      await formImageRef.current!.validateFields()
      await formInfoRef.current!.validateFields()

      const valueFormImage: IFormImage = formImageRef.current?.getFieldsValue()
      const valuesFormInfo: IFormProductInfo = formInfoRef.current!.getFieldsValue()

      const imageRequired = valueFormImage.imageRequired.map((value, index) => {
        return {
          type: Config._typeMedia.IMAGE,
          media_url: value.response ? value.response.data.filename : value.name,
          display_order: index,
          is_avatar: 1,
        }
      })

      const images = valueFormImage.images
        ? valueFormImage.images.map((value, index) => {
            return {
              type: Config._typeMedia.IMAGE,
              media_url: value.response ? value.response.data.filename : value.name,
              display_order: index + 1,
              is_avatar: 0,
            }
          })
        : []

      const putProductSub = splitArray(dataProductAttach.current, defaultProductAttach, 'key')
      const putProductSize = splitArray(dataAttributeSize.current, defaultProductSize, 'key')
      const putProductTopping = splitArray(dataListTopping.current, defaultDataTopping, 'toppingId')

      const reqPutProduct: IReqPutProduct = {
        name: valuesFormInfo.name,
        price: Number(valuesFormInfo.price),
        category_id: valuesFormInfo.categoryId,
        unit_id: valuesFormInfo.unitId,
        description: valuesFormInfo.description as string,
        display_order: Number(valuesFormInfo.displayOrder),
        df_attribute_id: valuesFormInfo.productConfigId,

        product_media: imageRequired.concat(images),

        topping_id: putProductTopping.newArray.map((value, index) => {
          return {
            topping_id: value.key,
            display_order: index + 1,
            status: value.status,
          }
        }),
        update_topping_id: putProductTopping.mergeArray.map((value) => {
          return { topping_id: value.id, status: value.status }
        }),
        delete_topping_id: putProductTopping.deleteArray.map((value) => value.id),

        new_product_sub_id: putProductSub.newArray.map((value) => {
          return {
            child_product_id: value.id,
            status: value.status,
          }
        }),
        update_product_sub_id: putProductSub.mergeArray.map((value) => {
          return { id: value.id, status: value.status }
        }),
        delete_product_sub_id: putProductSub.deleteArray.map((value) => value.id),

        new_product_size: putProductSize.newArray.map((value) => {
          return {
            name: value.name.value,
            price: Number(Config.parserFormatNumber(value.price.value)),
            is_default: value.isDefault.value,
            status: value.status,
          }
        }),
        update_product_size: putProductSize.mergeArray.map((value) => {
          return {
            id: value.key,
            name: value.name.value,
            price: Number(Config.parserFormatNumber(String(value.price.value))),
            status: value.status,
            is_default: value.isDefault.value,
          }
        }),
        delete_product_size: putProductSize.deleteArray.map((value) => {
          return value.key
        }),
      }

      const validateProductSize = (): { isValidity: boolean; msg: string } => {
        let result = {
          isValidity: true,
          msg: '',
        }

        dataAttributeSize.current.forEach((value) => {
          if (value.status) {
            if (!(value.name.value && value.price.value)) {
              result = {
                isValidity: false,
                msg: 'Vui lòng nhập đầy đủ thuộc tính và giá cộng thêm trong thuộc tính size sản phẩm.',
              }
            }
          }
        })

        const itemDuplicate = dataAttributeSize.current.find((value, index) => {
          let indexDuplicate = dataAttributeSize.current.findIndex((value1) => value1.name.value === value.name.value)
          return indexDuplicate !== index
        })

        if (itemDuplicate) {
          return {
            isValidity: false,
            msg: `Thuộc tính size sản phẩm ${itemDuplicate.name.value} bị trùng.`,
          }
        }

        return result
      }

      const validateImage = (): { isValidity: boolean; msg: string } => {
        if (reqPutProduct.product_media.length > 6) {
          return {
            isValidity: false,
            msg: 'Vui lòng xóa bớt ảnh tối đa 6 ảnh.',
          }
        }
        return {
          isValidity: true,
          msg: '',
        }
      }

      if (validateProductSize().isValidity && validateImage().isValidity) {
        const res = await putProductApi(id, reqPutProduct)
        if (res.body.status === Config._statusSuccessCallAPI) {
          Notification.PushNotification('SUCCESS', 'Cập nhật sản phẩm thành công.')
          history.push(ADMIN_ROUTER.PRODUCT_DETAIL.path + `?index=${id}`)
        }
      } else {
        !validateProductSize().isValidity && Notification.PushNotification('ERROR', validateProductSize().msg)
        !validateImage().isValidity && Notification.PushNotification('ERROR', validateImage().msg)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, submit: false })
    }
  }

  const onSubmit = async () => {
    try {
      if (isAdd) {
        onPost()
      } else {
        onPut()
      }
    } catch (e) {
      console.error(e)
      window.scroll({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const getDetail = async () => {
    try {
      setLoading({ ...loading, getDetail: true })
      const res = await getDetailProductApi(id)
      if (res.body.status) {
        setDetail(res.body.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading({ ...loading, getDetail: false })
    }
  }

  const defaultDataInfo = useMemo(() => {
    return {
      name: detail?.name as string,
      price: detail?.price as number,
      code: detail?.code as string,
      displayOrder: detail?.displayOrder as number,
      productConfigId: detail?.productAttributes.map((value) => value.id) as number[],
      description: detail?.description as string,
      categoryId: detail?.categoryId as number,
      unitId: detail?.unitId as number,
    }
  }, [detail])

  const getDefaultValueFormImage = (detailProduct: IResDataDetailProduct | undefined): IFormImage => {
    let rs: IFormImage = {
      images: [],
      imageRequired: [],
    }
    if (detailProduct) {
      for (let i = 0; i < detailProduct.productMedia.length; i++) {
        let { mediaPath, mediaUrl } = detailProduct.productMedia[i]
        if (i === 0) {
          rs.imageRequired = [
            {
              uid: mediaUrl,
              name: mediaPath,
              status: 'done',
              response: { data: { filename: mediaPath, url: mediaUrl } },
              url: mediaUrl,
            },
          ]
        } else {
          rs.images.push({
            uid: mediaUrl,
            name: mediaPath,
            status: 'done',
            response: { data: { filename: mediaPath, url: mediaUrl } },
            url: mediaUrl,
          })
        }
      }
    }
    return rs
  }

  const defaultProductSize = useMemo(() => {
    let rs: IDatasourceAttributeSize[] = []
    if (detail) {
      rs = detail.productSizes.map((value, index) => {
        return {
          key: value.id,
          name: { key: value.id, value: value.name, isValidity: true },
          price: { key: value.id, value: value.price, isValidity: true },
          totalPrice: value.price + +detail.price,
          isDefault: { key: value.id, value: value.isDefault },
          status: value.status,
          option: { key: value.id, status: value.status, isDefaultData: 1 },
        }
      })
    }
    return rs
  }, [detail])

  const defaultProductAttach = useMemo(() => {
    let rs: IDatasourceProductAttach[] = []
    if (detail) {
      rs = detail.parentProduct.map((value, index) => {
        let key = value.subProduct.sizeId ? value.subProduct.id + value.subProduct.sizeId : value.subProduct.id
        return {
          id: value.id,
          key: key,
          STT: index + 1,
          productName: value.subProduct.name,
          productSizeName: value.subProduct.sizeName,
          price: value.subProduct.sizePrice ? value.subProduct.sizePrice : value.subProduct.price,
          productId: value.subProduct.id,
          productSizeId: value.subProduct.sizeId,
          status: value.status,
          categoryId: 0,
          categoryName: value.subProduct.categoryName,
          unitName: value.subProduct.unitName,
          option: { key: key, status: value.status, isDefaultData: 1 },
        }
      })
    }
    return rs
  }, [detail])

  const defaultDataTopping = useMemo(() => {
    let rs: IDataSourceTopping[] = []
    if (detail) {
      rs = detail.productToppings.map((value, index) => {
        const key = value.toppingId
        return {
          id: value.id,
          STT: index + 1,
          key: key,
          toppingId: key,
          status: value.status,
          name: value.name,
          price: value.price,
          code: value.code,
          updateAt: '',
          displayOrder: value.displayOrder,
          thumbnailPath: '',
          thumbnailUrl: '',
          createAt: '',
          option: { key: key, status: value.status, isDefaultData: 1 },
        }
      })
    }
    return rs
  }, [detail])

  useEffect(() => {
    !isAdd && getDetail()
  }, [])

  return (
    <Spin spinning={loading.getDetail}>
      <Affix offsetTop={Config._offsetTopAffix}>
        <PageHeader
          title={isAdd ? 'Thêm mới sản phẩm' : 'Sửa sản phẩm'}
          onBack={() => history.goBack()}
          extra={[
            <Button type={'primary'} danger onClick={() => history.goBack()}>
              Hủy
            </Button>,
            <Button type={'primary'} onClick={onSubmit} loading={loading.submit}>
              Lưu
            </Button>,
          ]}
        />
      </Affix>

      <ProductInfo
        formInfo={(form) => {
          formInfoRef.current = form
        }}
        type={isAdd ? 'add' : 'update'}
        onChangePrice={(price) => setPriceInfo(price)}
        defaultForm={!isAdd ? defaultDataInfo : undefined}
      />
      <ProductImage
        form={(form) => (formImageRef.current = form)}
        defaultForm={useMemo(() => {
          return getDefaultValueFormImage(detail)
        }, [detail])}
      />
      <ProductSize
        onChange={(data) => (dataAttributeSize.current = data)}
        type={isAdd ? 'GET_ACTIVE' : 'GET_ALL'}
        priceInfo={priceInfo}
        defaultData={isAdd ? undefined : defaultProductSize}
      />
      <ProductAttach onChange={(data) => (dataProductAttach.current = data)} defaultData={defaultProductAttach} />
      <ProductTopping onChange={(data) => (dataListTopping.current = data)} defaultData={defaultDataTopping} />
    </Spin>
  )
}

export default AddUpdateProduct

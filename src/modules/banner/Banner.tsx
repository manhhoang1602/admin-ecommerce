import React, { useEffect, useState } from 'react'
import { Button, Col, DatePicker, Input, PageHeader, Popconfirm, Row, Select, Space, Tag } from 'antd'
import { SelectStatus } from '../../commons/select-status/SelectStatusComponent'
import RangePickerHoc from '../../commons/HOC/RangePickerHOC'
import TableHoc from '../../commons/HOC/TableHOC'
import { Table } from 'antd/es'
import { IColumn } from '../../services/Interfaces'
import { observer } from 'mobx-react'
import store, { DEFINE_BANNER_STATUS, DEFINE_BANNER_TYPE } from './BannerStore'
import { IPayloadBanner, IResDataBanner } from './BannerInterface'
import { DEFAULT_PAGE } from '../Constances'
import Config from '../../services/Config'
import { Moment } from '../../services/Moment'
import { RenderStatus } from '../component/Component'
import Icon from '../../commons/icon/Icon'
import PopconfirmHOC from '../../commons/HOC/PopconfirmHOC'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'

const RenderTagBannerType = (type: number) => {
  if (type === DEFINE_BANNER_TYPE.BANNER) {
    return <Tag color={'blue'}>Banner</Tag>
  }
  if (type === DEFINE_BANNER_TYPE.NEWS) {
    return <Tag color={'orange'}>Tin tức</Tag>
  }
  if (type === DEFINE_BANNER_TYPE.POLICY) {
    return <Tag color={'purple'}>Chính sách</Tag>
  }
  if (type === DEFINE_BANNER_TYPE.PROMOTION) {
    return <Tag color={'green'}>Khuyễn mãi</Tag>
  }
}

const RenderTagStatusBanner = (status: number) => {
  if (status === DEFINE_BANNER_STATUS.PUBLIC) {
    return <Tag color={'green'}>Đăng bài</Tag>
  }
  if (status === DEFINE_BANNER_STATUS.DRAFT) {
    return <Tag color={'purple'}>Lưu nháp</Tag>
  }
}

export const SelectBannerTypeComponent = (props: {
  onChange?: (value: number | undefined) => any
  defaultValue?: number | undefined
}) => {
  const { onChange, defaultValue } = props

  const [value, setValue] = useState<number | undefined>()

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Select
      allowClear={true}
      placeholder={'Loại banner'}
      onChange={(value) => {
        onChange && onChange(value as number | undefined)
        setValue(value)
      }}
      value={value}
      optionFilterProp={'children'}
    >
      <Select.Option value={DEFINE_BANNER_TYPE.BANNER}>Banner</Select.Option>
      <Select.Option value={DEFINE_BANNER_TYPE.POLICY}>Chính sách</Select.Option>
      <Select.Option value={DEFINE_BANNER_TYPE.NEWS}>Tin tức</Select.Option>
      <Select.Option value={DEFINE_BANNER_TYPE.PROMOTION}>Khuyến mãi</Select.Option>
    </Select>
  )
}

export const SelectBannerStatus = (props: {
  onChange?: (value?: number) => any
  defaultValue?: number
  disabled?: boolean
}) => {
  const { onChange, defaultValue, disabled } = props

  const [value, setValue] = useState<number | undefined>()

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Select
      allowClear={true}
      value={value}
      optionFilterProp={'children'}
      placeholder={'Trạng thái banner'}
      disabled={disabled}
      onChange={(value) => {
        onChange && onChange(value as number | undefined)
        setValue(value)
      }}
    >
      <Select.Option value={DEFINE_BANNER_STATUS.PUBLIC}>Đăng bài</Select.Option>
      <Select.Option value={DEFINE_BANNER_STATUS.DRAFT}>Lưu nháp</Select.Option>
    </Select>
  )
}

const Banner = observer(() => {
  const [payload, setPayload] = useState<IPayloadBanner>({
    page: DEFAULT_PAGE,
    endDate: undefined,
    search: undefined,
    startDate: undefined,
    limit: Config._limit,
    post_status: undefined,
    status: undefined,
    type: undefined,
  })

  const columns: IColumn[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 50,
      align: 'center',
      render: (STT: number, row, index) => <div>{STT}</div>,
    },
    {
      title: 'Tiêu đề Banner',
      key: 'title',
      dataIndex: 'title',
      render: (title: string, row, index) => <div>{title}</div>,
    },
    {
      title: 'Loại banner',
      key: 'type',
      dataIndex: 'type',
      render: (type: number, row, index) => <div>{RenderTagBannerType(type)}</div>,
    },
    {
      title: 'Trạng thái',
      key: 'postStatus',
      dataIndex: 'postStatus',
      align: 'center',
      render: (postStatus: number, row, index) => <div>{RenderTagStatusBanner(postStatus)}</div>,
    },
    {
      title: 'Trạng thái hoạt động',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (status: number, row, index) => <div>{RenderStatus(status)}</div>,
    },
    {
      title: 'Ngày tạo',
      key: 'createAt',
      dataIndex: 'createAt',
      align: 'center',
      render: (createAt: string, row, index) => <div>{Moment.getDate(createAt, 'DD/MM/YYYY')}</div>,
    },
    {
      title: 'Thao tác',
      key: 'option',
      dataIndex: 'option',
      align: 'center',
      render: (option: IResDataBanner, row, index) => (
        <div>
          <Space>
            <PopconfirmHOC>
              <Popconfirm
                title={'Bạn có chắc muốn xóa banner này ra khỏi hệ thống không.'}
                onConfirm={async (e) => {
                  const result = await store.deleteBanner(option.id)
                  if (result) {
                    store.getListBanner(payload)
                  }
                }}
              >
                <span style={{ fontSize: 18, color: 'red' }}>{Icon.BUTTON.DELETE}</span>
              </Popconfirm>
            </PopconfirmHOC>
            <span
              style={{ fontSize: 18, color: 'orange' }}
              onClick={(event) => history.push(ADMIN_ROUTER.BANNER_ADD_UPDATE.path + `?index=${option.id}`)}
            >
              {Icon.BUTTON.EDIT}
            </span>
          </Space>
        </div>
      ),
    },
  ]

  useEffect(() => {
    const idTimeout = setTimeout(() => {
      store.getListBanner({ ...payload, search: payload.search?.trim() })
    }, 500)

    return () => clearTimeout(idTimeout)
  }, [payload])

  return (
    <div>
      <PageHeader
        title={'Banner + Tin tức'}
        extra={
          <Button type={'primary'} onClick={(event) => history.push(ADMIN_ROUTER.BANNER_ADD_UPDATE.path)}>
            Thêm mới
          </Button>
        }
      />

      <div className={'style-box'}>
        <Row gutter={[32, 16]}>
          <Col md={4}>
            <Input
              placeholder={'Tiêu đề banner'}
              allowClear={true}
              onChange={(event) => setPayload({ ...payload, search: event.target.value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col md={4}>
            <SelectBannerTypeComponent
              onChange={(value) => setPayload({ ...payload, type: value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col md={4}>
            <SelectBannerStatus
              onChange={(value) => setPayload({ ...payload, post_status: value, page: DEFAULT_PAGE })}
            />
          </Col>
          <Col md={4}>
            <SelectStatus onChange={(value) => setPayload({ ...payload, status: value, page: DEFAULT_PAGE })} />
          </Col>
          <Col md={4}>
            <RangePickerHoc
              onChange={(stringDate) =>
                setPayload({
                  ...payload,
                  startDate: stringDate[0] ? stringDate[0] : undefined,
                  endDate: stringDate[1] ? stringDate[1] : undefined,
                  page: DEFAULT_PAGE,
                })
              }
            >
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </RangePickerHoc>
          </Col>
          <Col md={4}>
            <Row justify={'end'} style={{ marginTop: 5 }}>
              Kết quả lọc: {store.total}
            </Row>
          </Col>
        </Row>
      </div>

      <div className={'style-box'}>
        <TableHoc>
          <Table
            loading={store.loading.getListBanner}
            columns={columns}
            dataSource={store.listBanner}
            pagination={{
              onChange: (page) => setPayload({ ...payload, page: page }),
              current: payload.page,
              total: store.total,
            }}
          />
        </TableHoc>
      </div>
    </div>
  )
})

export default Banner

import React, { useEffect } from 'react'
import { Card, Col, PageHeader, Row, Statistic } from 'antd'
import LineChart from '../../commons/chart/LineChart'
import { observer } from 'mobx-react'
import store from './DashboardStore'

const Dashboard = observer(() => {
  useEffect(() => {
    store.getDataDashboard({})
  }, [])

  return (
    <>
      <PageHeader
        title={'Tổng quan'}
        // extra={
        //   <RangePickerHoc disableDate={'AGO'}>
        //     <DatePicker.RangePicker />
        //   </RangePickerHoc>
        // }
      />
      <div className="site-statistic-demo-card" style={{ padding: '0 8px' }}>
        <Row gutter={8}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Hoàn thành"
                value={store.dataDashboard?.totalDoneOrder}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Khách hàng"
                value={store.dataDashboard?.totalCustomer}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Cửa hàng" value={store.dataDashboard?.totalShop} valueStyle={{ color: 'blueviolet' }} />
            </Card>
          </Col>
        </Row>
      </div>
      <div className={'style-box'}>
        <Card title={'Đơn hàng'} bordered={false}>
          <Row gutter={8} style={{ marginBottom: 22 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Hoàn thành"
                  value={store.dataDashboard?.totalDoneOrder}
                  valueStyle={{ color: 'orange' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Chờ xác nhận"
                  value={store.dataDashboard?.totalPendingOrder}
                  valueStyle={{ color: 'purple' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đang giao"
                  value={store.dataDashboard?.totalDeliveringOrder}
                  valueStyle={{ color: 'blueviolet' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Hủy/ Từ chối"
                  value={store.dataDashboard?.totalCancelOrder}
                  valueStyle={{ color: 'red' }}
                />
              </Card>
            </Col>
          </Row>
          <LineChart data={store.dataChart} height={100} />
        </Card>
      </div>
    </>
  )
})

export default React.memo(Dashboard)

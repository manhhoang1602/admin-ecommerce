import React, { useEffect } from 'react'
import { Button, Col, Form, Image, Input, Row } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { loginAction } from './LoginSlice'
import Config from '../../services/Config'
import { useForm } from 'antd/es/form/Form'
import { getToken } from '../../services/Basevices'
import history from '../../services/history'
import { ADMIN_ROUTER } from '../../router/AdminRouter'

export interface IFormData {
  account: string
  password: string
}

const Login = () => {
  const dispatch = useAppDispatch()
  const loginState = useAppSelector((state) => state.loginReducer)

  const [form] = useForm()

  const onLogin = async (values: IFormData) => {
    try {
      await dispatch(loginAction({ account: values.account, password: values.password }))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (getToken()) {
      history.push(ADMIN_ROUTER.DASHBOARD.path)
    }
  })

  return (
    <div className={'login'}>
      <Row style={{ height: '100vh' }} justify={'center'}>
        <Col md={12}>
          <div className={'login__form'}>
            <div className={'login__form__logo'}>
              <Image src={'/logo.png'} preview={false} style={{ width: 220 }} />
            </div>
            <div className={'login__form__wrapper-form'}>
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                className={'label-left'}
                onFinish={onLogin}
                form={form}
                size={'large'}
              >
                <Form.Item
                  label={'Tài khoản'}
                  name={'account'}
                  rules={[
                    { required: true, whitespace: true, message: 'Vui lòng nhập tài khoản.' },
                    { pattern: Config._reg.phone, message: 'Tài khoản không đúng định dạng' },
                  ]}
                >
                  {/*<NumberFormat*/}
                  {/*  format={'### ### ####'}*/}
                  {/*  onChange={(event) => {*/}
                  {/*    form.setFieldsValue({ account: Config.replaceWhiteSpace(event.target.value) })*/}
                  {/*  }}*/}
                  {/*/>*/}
                  <Input />
                </Form.Item>
                <Form.Item
                  label={'Mật khẩu'}
                  name={'password'}
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khâu.' },
                    { type: 'string', min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
                  ]}
                >
                  <Input.Password
                    iconRender={(visible: any) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item wrapperCol={{ md: { offset: 6 } }}>
                  <Button
                    loading={loginState.loading.loadingLogin}
                    type={'primary'}
                    // danger
                    style={{ width: '100%' }}
                    htmlType={'submit'}
                    className={'btn-success'}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div className={'login__img'}>
            <Image src={'/assets/img/zoco.png'} preview={false} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Login

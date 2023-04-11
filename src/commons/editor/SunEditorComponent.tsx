import React, { useEffect, useRef, useState } from 'react'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import plugins from 'suneditor/src/plugins'
import { Form, FormInstance, FormItemProps } from 'antd'
import SunEditorCore from 'suneditor/src/lib/core'
import { useForm } from 'antd/es/form/Form'

interface IProps extends FormItemProps {
  onChange?: (values?: string) => any
  placeholder?: string
  disable?: boolean
  form: FormInstance
  loading?: boolean
  height?: string
}

const SunEditorComponent: React.FC<IProps> = ({
  onChange,
  placeholder,
  loading,
  disable,
  form,
  height = '300px',
  ...rest
}) => {
  const buttonList = [
    ['undo', 'redo'],
    ['font', 'fontSize', 'formatBlock'],
    ['paragraphStyle', 'blockquote'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['fontColor', 'hiliteColor', 'textStyle'],
    ['removeFormat'],
    ['outdent', 'indent'],
    ['align', 'horizontalRule', 'list', 'lineHeight'],
    ['table', 'link' /** ,'math' */],
    ['fullScreen', 'showBlocks'],
  ]

  const formInstances = useRef<FormInstance>()
  const editor = useRef<SunEditorCore>()

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor
  }

  useEffect(() => {
    formInstances.current = form
  }, [])

  useEffect(() => {
    loading &&
      setTimeout(() => {
        editor.current?.setContents(formInstances.current?.getFieldValue({ ...rest }.name as string))
      }, 1000)
  }, [loading])

  return (
    <Form.Item {...rest}>
      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        placeholder={placeholder}
        setAllPlugins={false}
        disable={disable}
        setOptions={{
          height: height,
          plugins: plugins,
          buttonList: buttonList,
        }}
        setDefaultStyle={'font-family: "Open Sans", sans-serif !important; font-size: 14px;'}
        onChange={(content) => {
          onChange && onChange(content)
          formInstances.current?.setFieldsValue({ [{ ...rest }.name as string]: content })
        }}
      />
    </Form.Item>
  )
}

export default SunEditorComponent

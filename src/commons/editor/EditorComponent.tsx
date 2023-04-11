import React, { CSSProperties, useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import { usePrev } from '../../services/CustomHook'

interface IProps {
  onChange?: (value: string) => any
  option?: string[]
  value?: string
  height?: number | string
  width?: number | string
  editorStyle?: CSSProperties
}

const EditorComponent: React.FC<IProps> = ({ onChange, value, width, height, editorStyle, option }) => {
  const defaultOption: string[] = [
    'inline',
    'blockType',
    'fontSize',
    'fontFamily',
    'list',
    'textAlign',
    'colorPicker',
    'link',
    'embedded',
    'emoji',
    'image',
    'remove',
    'history',
  ]

  const [editorState, setEditorState] = useState<EditorState>()

  const onEditorStateChange = (editorState: EditorState) => {
    onChange && onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    setEditorState(editorState)
  }

  const handleValue = () => {
    const html = value ? value : ''
    const contentBlock = htmlToDraft(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setEditorState(editorState)
    }
  }

  const prevState = usePrev(value)

  useEffect(() => {
    !prevState && handleValue()
  }, [value])

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      toolbar={{ options: option ? option : defaultOption }}
      editorStyle={{ ...editorStyle, height: height ? height : 200, width: width ? width : '100%' }}
    />
  )
}

export default React.memo(EditorComponent)

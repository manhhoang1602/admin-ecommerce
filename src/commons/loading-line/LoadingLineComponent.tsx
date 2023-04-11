import React, { CSSProperties } from 'react'
import './LoadingLineComponent.scss'

interface IProps {
  loading: boolean
  style: CSSProperties
}

const LoadingLineComponent: React.FC<IProps> = ({ loading, style }) => {
  if (loading) {
    return (
      <div style={style} className={'loading-line-component'}>
        <div className={'loading-line-component__thumb'} />
      </div>
    )
  } else return null
}

export default LoadingLineComponent

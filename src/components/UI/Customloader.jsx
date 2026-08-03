import { Spin } from 'antd'
import React from 'react'
import "../../App.css"

const Customloader = () => {
  return (
    <div
   className='customLoader'
    >
      <Spin size="large" />
    </div>
  )
}

export default Customloader
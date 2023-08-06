import React from "react";
import { Button } from 'antd-mobile'
import indexModule from './style.module.less'

export default function Index() {
  return <div className={indexModule.index}>
    <span>Index</span><Button color='primary'>Primary</Button>
  </div>
}
import React from "react";
import {TabBar } from 'antd-mobile'
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"
import {BillOutline, PieOutline, UserOutline } from 'antd-mobile-icons'
import s from './style.module.less'

const NavBar = function({showNav}) {
  const navigate = useNavigate();
  const changeTab = function(path) {
    navigate(path)
  }
  // const items = [
  //   {
  //     key: '/',
  //     title: '首页',
  //     icon: <BillOutline />
  //   },
  //   {
  //     key: '/data',
  //     title: '统计',
  //     icon: <PieOutline />
  //   },
  //   {
  //     key: '/user',
  //     title: '我的',
  //     icon: <UserOutline />
  //   }
  // ]
  

  return <div className={s.NavBar}>
    <TabBar onChange={(activeKey) => changeTab(activeKey)}>
      {/* {items.map((item) => {
        <TabBar.Item key={item.key} title={item.title} icon={item.icon} />
      })} */}
      <TabBar.Item key="/" title="首页" icon={<BillOutline />} />
      <TabBar.Item key="/data" title="统计" icon={<PieOutline />} />
      <TabBar.Item key="/user" title="我的" icon={<UserOutline />} />
    </TabBar>
  </div>    
}

NavBar.PropTypes = {
  showNav: PropTypes.bool
}

export default NavBar
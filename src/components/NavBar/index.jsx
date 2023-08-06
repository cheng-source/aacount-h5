import React from "react";
import {TabBar } from 'antd-mobile'
import { useNavigate } from "react-router-dom";

const NavBar = function({showNav}) {
  const navigate = useNavigate();
  const changeTab = function(path) {
    navigate(path)
  }
  

  return <div>
    <TabBar onChange={(activeKey) => changeTab(activeKey)}>
      <TabBar.Item key="/" title="首页" />
      <TabBar.Item key="/data" title="统计" />
      <TabBar.Item key="/user" title="我的" />
    </TabBar>
  </div>         
}

export default NavBar
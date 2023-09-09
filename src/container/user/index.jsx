import React, {useState} from "react";
import s from './style.module.less'
import { useEffect } from "react";
import {get} from '../../utils/index'
import { Card,Divider, Button } from "antd-mobile";
import { RightOutline } from 'antd-mobile-icons'
import { useNavigate } from "react-router-dom";

const User = function() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    getUserInfo();
  }, [])
  const getUserInfo = async () => {
    const {data} = await get('/api/user/getUserInfo');
    console.log(data);
    setUser(data);

  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }
  return <div className={s.user}>
    <div className={s.head}>
      <div className={s.info}>
        <span>昵称：{user.username || '--'}</span>
        <span>
          <img style={{ width: 30, height: 30, verticalAlign: '-10px' }}  src="//s.yezgea02.com/1615973630132/geqian.png" alt="" />
          <b>{user.signature || '暂无个性签名'}</b>
        </span>
      </div>
      <img  className={s.avatar}  style={{ width: 60, height: 60, borderRadius: 8 }} src={user.avatar || ''} alt="" />
    </div>
    <div className={s.content}>
    <Card
      headerStyle={{
        color: '#1677ff',
      }}
    >
          <div className={s.item} onClick={() => navigate('/userinfo')}>
            <div className={s.left}>
              <span><img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" /></span>
              <span>用户信息修改</span>
            </div>
            <div className={s.right}>
              <RightOutline />
            </div>
          </div>
          <Divider />
          <div  className={s.item} onClick={() => navigate('/account')}>
            <div className={s.left}>
              <span><img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" /></span>
              <span>重制密码</span>
            </div>
            <div className={s.right}>
              <RightOutline />
            </div>
          </div>
          <Divider />
          <div  className={s.item} onClick={() => navigate('/about')}>
            <div className={s.left}>
              <span><img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615975178434/lianxi.png" alt="" /></span>
              <span>关于我们</span>
            </div>
            <div className={s.right}>
              <RightOutline />
            </div>
          </div>
        </Card>
       
    </div>
    <Button className={s.logout} block color="danger" onClick={logout}>退出登录</Button>
  </div>
}

export default User
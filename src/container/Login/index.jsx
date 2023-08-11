import React from "react";
import s from './style.module.less';
import { Grid, Input,Button,Checkbox, Toast } from 'antd-mobile'
import '@/assets/font/iconfont.css'
import loginStyle from './style.module.less'
import Captcha from 'react18-verify-code';
import { useState } from "react";
import {get, post} from '@/utils/index.js'


const Login = () => {
  // console.log(loginStyle);
  const [username, setUsername] = useState(''),
        [password, setPassword] = useState(''),
        [verify, setVerify] = useState('');

  const [type, setType] = useState('login');

  const handleCaptcha = (captcha) => {
    console.log(captcha);

  }

  const submit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码');
      return
    }
    if (!verify) {
      Toast.show('请输入验证码')
      return
    }
    console.log(post);
    try {
      if (type === 'login') {
        const {data} = await post('api/user/login', {
          username,
          password
        });
        localStorage.setItem('token', data.token)
        
      } else {
        const data = await post('api/user/register', {
          username,
          password
        })
        // console.log(data);
        Toast.show(data.msg)
      }

    } catch (error) {
      Toast.show('系统错误')
    }

  }

  return <div className={loginStyle.login}>

    <div className={loginStyle.head}></div>


  <div className={loginStyle.tab}>
    <span className={type === 'login' ? loginStyle.active : ''} onClick={() => setType('login')}>登陆</span>
    <span className={type === 'register' ? loginStyle.active : ''} onClick={() => setType('register')}>注册</span>
  </div>

    <div className={loginStyle.form}>
        <Grid columns={10} gap={20}>
          <span className="iconfont icon-mobile"></span>
          <Grid.Item span={9}>
          <Input placeholder='请输入账号' onChange={value => setUsername(value)} />
          </Grid.Item>

          <Grid.Item>
          <span className="iconfont icon-password"></span>
          </Grid.Item>
          <Grid.Item span={9}>
          <Input placeholder='请输入密码' onChange={value => setPassword(value)} />
          </Grid.Item>
          {type === 'register' ? <>
                  <Grid.Item>
                    <span className="iconfont icon-captcha"></span>
                    </Grid.Item>
                    <Grid.Item span={6}>
                      <Input placeholder='请输入验证码' onChange={value => setVerify(value)} />
                    </Grid.Item>
                    <Grid.Item span={3}>
                      <Captcha charNum={4} onChange={handleCaptcha} />
                    </Grid.Item>
          </>

          : null}

        </Grid>
    </div>

    <div className={loginStyle.operation}>
      <div className={loginStyle.agree}>
      <Checkbox value=''>
        <label>
        阅读并同意<a href="#">《xxxx条款》</a>
        </label>
      </Checkbox>
        
        
      </div>
      <Button block color='primary' size='large' onClick={submit}> {type === 'login' ? '登陆' : '注册'}</Button>
    </div>

  </div>
}

export default Login;
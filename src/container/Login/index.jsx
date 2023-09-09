import React from "react";
import { Grid, Input,Button,Checkbox, Toast } from 'antd-mobile'
import loginStyle from './style.module.less'
import Captcha from 'react18-verify-code';
import { useState } from "react";
import { post} from '@/utils/index.js'
import { useNavigate } from "react-router-dom";


const Login = () => {
  // console.log(loginStyle);
  const navigate = useNavigate()
  const [username, setUsername] = useState(''),
        [password, setPassword] = useState(''),
        [verify, setVerify] = useState(''),
        [checked, setChecked] = useState(false);
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
    if (!verify && type !== 'login') {
      Toast.show('请输入验证码')
      return
    }
    if (!checked) {
      Toast.show('请同意《xxxx条款》')
      return
    }
    try {
      let res = {};
      if (type === 'login') {
        res = await post('api/user/login', {
          username,
          password
        });
        console.log(res);
        localStorage.setItem('token', res.data.token);
        // 之所以用 window.location.href 的原因是，utils/axios.js 内部需要再次被执行，才能通过 localStorage.getItem 拿到最新的 token。
        // 如果只是用 navigateTo 跳转页面的话，页面是不会被刷新，那么 axios.js 的 token 就无法设置。
        window.location.href = '/'
      } else {
        res = await post('api/user/register', {
          username,
          password
        })
        Toast.show('注册成功')
        setType('login')
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
      <Checkbox value={checked} onChange={checked => setChecked(checked)}>
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
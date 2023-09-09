import React from "react";
import s from './style.module.less'
import Header from '../../components/Header'
import { Form, Button,Input, Toast } from "antd-mobile";
import { get, post } from "../../utils";
import { useNavigate } from "react-router-dom";

const Account = function() {
  const navigate =  useNavigate();
  const [form] = Form.useForm();
  const submit = async function() {
    console.log(form);
    const oldPassword = form.getFieldValue('oldPassword');
    const newPassword1 = form.getFieldValue('newPassword1');
    const newPassword2 = form.getFieldValue('newPassword2');
    if (newPassword1 !== newPassword2) {
      Toast.show({
        icon: 'fail',
        content:'新密码输入不一致'
      })
      
      return;
    }
    await post('/api/user/modifyPassword', {
      oldPassword,
      newPassword:newPassword1
    });
    Toast.show({
      icon: 'success',
      content: '修改成功'
    })
    navigate(-1);
  }
  return <div className={s.account}>
    <Header title="重置密码"></Header>
    <Form
        form={form}
        layout='horizontal'
        footer={
          <Button block type='submit' color='primary' size='large' onClick={submit}>
            提交
          </Button>
        }
        requiredMarkStyle='none'
      >
        <Form.Item
          name='oldPassword'
          label='原密码'
          rules={[{ required: true, message: '不能为空' }]}
          
        >
          <Input onChange={console.log} />
        </Form.Item>
        <Form.Item
          name='newPassword1'
          label='新密码'
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input onChange={console.log}/>
        </Form.Item>
        <Form.Item
          name='newPassword2' 
          label='确认密码'
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input onChange={console.log}/>
        </Form.Item>
      </Form>
  </div>
}

export default Account;
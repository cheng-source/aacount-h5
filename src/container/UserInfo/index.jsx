import React, {useState} from "react";
import { ImageUploader, Input, Button, Toast} from 'antd-mobile';
import Header from '../../components/Header/index';
import { useNavigate } from "react-router-dom";
import s from './style.module.less';
import { useEffect } from "react";
import { get, post } from "../../utils";
import { baseUrl } from '../../config';  // 由于直接使用 axios 进行请求，统一封装了请求 baseUrl
import axios from 'axios'; // // 由于采用 form-data 传递参数，所以直接只用 axios 进行请求
import { imgUrlTrans } from "../../utils";

const UserInfo = function() {
const navigate = useNavigate();
const [user, setUser] = useState({});
const [avatar, setAvatar] = useState([]);
const [signature, setSignature] = useState('');
const token = localStorage.getItem('token');

  useEffect(() => {
    getUserInfo();
  },[]);
  const getUserInfo = async () => {
    const {data} = await get('/api/user/getUserInfo');
    setUser(data);
    setAvatar([{url: data.avatar}]);
    setSignature(data.signature);
  }

  const save = async () => {
      const {data} = await post('/api/user/editUserInfo', {
        signature,
        avatar
      });
      Toast.show('修改成功');
      navigate(-1);
  }
  
  const limitImage = (file) => {
    const limit = 200 * 1024;
    if (limit < file.size) {
        Toast.show({
          icon: 'fail',
          content: '图片必须在20KB内'
        })
        return null;
    }
    return file
  }
  let temp;
  const uploadImage = async (file) => { 
    let formData = new FormData();
        // 生成 form-data 数据类型
        formData.append('file', file);
        console.log(baseUrl);
        await axios({
          method: 'post',
          url: `${baseUrl}/upload`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token
          }
        }).then(res => {
          // 返回图片地址
          console.log('成功',res);
          temp = res.data;
          setAvatar([{url: imgUrlTrans(temp)}])
        })
        console.log(imgUrlTrans(temp));
        return {url: imgUrlTrans(temp)}
  }

  return <div>
        <Header title="用户信息"></Header>
        <div className={s.userinfo}>
          <h1>个人资料</h1>
          <div className={s.item}>  
            <div className={s.title}>
              头像
            </div>
            <div className={s.avatar}>
              <div className={s.desc}>
                <ImageUploader
                  value={avatar}
                  onDelete={() => setAvatar([])}
                  beforeUpload={limitImage}
                  upload={uploadImage}
                  maxCount={1}
                />
                <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              </div>
            </div>

          </div>

        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value) => setSignature(value)}
            />
          </div>
        </div>
          <Button onClick={save} style={{ marginTop: 50 }} block>保存</Button>
       </div>
      </div>

}
export default UserInfo
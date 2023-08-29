import React, { useEffect, useState, useRef } from "react";
import { DeleteOutline,EditSOutline } from "antd-mobile-icons";
import { Modal,Toast} from 'antd-mobile'
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import PopupAddBill from '../../components/PopupAddBill/index'
import s from './style.module.less'
import cns from "classnames";
import qs from 'query-string'
import dayjs from "dayjs";
import {get, post} from '../../utils/index'
import fontTypeMap from "../../utils/fontTypeMap";


const Detail = () => {
  const [detail, setDetail] = useState({});
  const location = useLocation();
  const navigate = useNavigate()
  const {id} = qs.parse(location.search);
  const editRef = useRef()

  useEffect(() => {
    getDetail();
  }, []);

  console.log(detail);

  const getDetail = async () => {
    const result = await get(`/api/bill/detail?id=${id}`);
    setDetail(result.data)
  }

  const deleteDetail = () => {
    Modal.confirm({
      content: '确认删除？',
      onConfirm: async () => {
        await post('/api/bill/delete', {id});
        Toast.show({
          icon: 'success',
          content: '删除成功',
        })
        navigate(-1)
      },
    })
  }

  return <div className={s.detail}>
     <Header title="账单详情"></Header>
     <div className={s.card}>

      <div className={s.type}>
        <span>
          <span className={`iconfont icon-${detail.type_id ? fontTypeMap[detail.type_id].icon  : 1}`}></span>
        </span>
        
        <span>{detail.type_name}</span>
      </div>
      {
        detail.pay_type === 1 ? 
        <div className={cns(s.amount, s.expense)}>-{detail.amount}</div> :
        <div className={cns(s.amount, s.income)}>+{detail.amount}</div>
      }
      <div className={s.info}>
        <div className={s.time}>
          <span>记录时间</span>
          <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
        </div>

        <div className={s.remark}>
          <span>备注</span>
          <span>{detail.remark || '-'}</span>
        </div>

      </div>

      <div className={s.operation}>
        <span  onClick={() => deleteDetail()}>
          <DeleteOutline />
          <span>删除</span>
        </span>
      
        <span onClick={() => editRef.current.show()}>
          <EditSOutline />
          <span>编辑</span>
        </span>
      </div>
     </div>
     <PopupAddBill ref={editRef} detail={detail} onReload={getDetail}></PopupAddBill>
  </div>
}

export default Detail
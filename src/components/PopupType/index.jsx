import React, { forwardRef, useEffect,useState } from 'react';
import { Popup } from 'antd-mobile';
import s from './style.module.less';
import {get} from './../../utils/index.js';
import cns from 'classnames';

const PopupType = forwardRef(function PopupType({onSelect}, ref){
  const [show, setShow] = useState(false);
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  const [active, setActive] = useState('all'); // 激活的 type

  useEffect(() => {
    (async () => {
    const { data: { list } } = await get('/api/type/list')
    setExpense(list.filter(i => i.type === 1))
    setIncome(list.filter(i => i.type === 2))
    })()
  }, [])

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false);
      }
    }
  }

    // 选择类型回调
    const choseType = (item) => {
      setActive(item.id)
      setShow(false)
      // 父组件传入的 onSelect，为了获取类型
      onSelect(item)
    };

  return <Popup
  visible={show}
  onMaskClick={() => {
    setShow(false)
  }}
  onClose={() => {
    setShow(false)
  }}
  bodyStyle={{ height: '40vh' }}
>
<div style={{ height: '40vh', overflowY: 'scroll' }} className={s.popupType}>
      <div className={s.header}>
        请选择类型
      </div>
      <div className={s.content}>
        <div onClick={() => choseType({ id: 'all' })} className={cns({ [s.all]: true, [s.active]: active == 'all' })} >全部类型</div>
        <div className={s.title}>支出</div>
        <div className={s.expenseWrap}>
          {
            expense.map((item, index) => <p key={index} className={cns({[s.active]: active == item.id})} onClick={() => choseType(item)} >{ item.name }</p>)
          }
        </div>
        <div className={s.title}>收入</div>
        <div className={s.incomeWrap}>
          {
            income.map((item, index) => <p key={index} className={cns({[s.active]: active == item.id})} onClick={() => choseType(item)} >{ item.name }</p>)
          }
        </div>
      </div>
    </div>
</Popup>
})
export default PopupType;
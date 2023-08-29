import React, {useState, useRef, useEffect} from "react";
import { Popup, NumberKeyboard, TextArea, Toast } from 'antd-mobile';
import { forwardRef } from "react";
import cns from "classnames";
import s from './style.module.less'
import PopupDate from "../PopupDate";
import { DownOutline } from 'antd-mobile-icons';
import dayjs from "dayjs";
import PropTypes from 'prop-types';
import {get, post} from './../../utils/index.js';
import fontTypeMap from "../../utils/fontTypeMap";

const PopupAddBill = forwardRef(function PopupAddBill({detail = {}, onReload}, ref) {
  const [show, setShow] = useState(false);
  const [payType, setPayType] = useState('expense');
  const [time, setTime] = useState(new Date())
  const timeRef = useRef();
  const [amount, setAmount] = useState('');
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  const [currentType, setCurrentType] = useState({});
  const [remark, setRemark] = useState('');
  const [showRemark, setShowRemark] = useState(false);

  const id = detail.id;

  useEffect(() => {
    if (detail.id) {
      setPayType(detail.pay_type === 1 ? 'expense' : 'income');
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name
      });
      setTime(dayjs(Number(detail.date)));
      setRemark(detail.remark);
      setAmount(detail.amount);
    }
  }, [detail]);

  useEffect(() => {
    (async () => {
    const { data: { list } } = await get('/api/type/list')
    const _expense = list.filter(i => i.type === 1),
          _income = list.filter(i => i.type === 2);
    setExpense(_expense)
    setIncome(_income)
    setCurrentType(_expense[0]);
    })()
  }, [])


  const selectTime = (val) => {
    setTime(val)
  }

  const changePayType = (type) => {
    setPayType(type);
  }
  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      }
    }
  }

  const handleInput = (val) => {
    // 不能输入两个小数点.
    if (val === '.' && amount.includes('.')) return
    // 小数点后只能有两位
    if (amount.includes('.') && amount.split('.')[1].length >= 2) return; 
    console.log(val);
    setAmount(amount+val)
  }
  const handleDelete = () => {
    let _amount = amount.slice(0, amount.length - 1);
    setAmount(_amount);
    return
  }

  const handleOk = () => {
    addBill()
  }

  const addBill = async () => {
    if (!amount) {
      Toast.show({
        icon: 'fail',
        content: '请输入金额'
      })
    }
    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: time,
      pay_type: payType === 'expense' ? 1 : 2,
      remark: remark || ''
    }
    if (id) {
      params.id = id;
      await post('/api/bill/update', params);
      Toast.show({
        icon: 'success',
        content: '修改成功'
      });
    } else {
      await post('/api/bill/add', params);
      setAmount('');
      setPayType('expense');
      setCurrentType(expense[0]);
      setTime(new Date());
      setRemark('');
      Toast.show({
        icon: 'success',
        content: '添加成功'
      });
    }

    setShow(false);
    if (onReload) {
      console.log('reload');
      onReload();
    } 
  }

  return <Popup
  visible={show}
  onMaskClick={() => {
    setShow(false)
  }}
  onClose={() => {
    setShow(false)
  }}
  bodyStyle={{ height: '70vh' }}
  showCloseButton
  >
    <div className={s.addBill}>
      <div className={s.filter}>
        <div className={s.type}>
          <span className={cns({[s.expense]: true,  [s.active]: payType == 'expense'})} onClick={() => {changePayType('expense')}}>支出</span>
          <span className={cns({[s.income]: true,  [s.active]: payType == 'income'})} onClick={() => {changePayType('income')}}>收入</span>
        </div>
        <div className={s.time} onClick={() => timeRef.current && timeRef.current.show()}>
          <span>{dayjs(time).format('MM-DD')}</span><DownOutline />
        </div>
      </div>
      <div className={s.money}>
        <span className={s.suffix}>￥</span>
        <span className={cns(s.amount, s.animation)}>{amount}</span>
      </div>
      <div className={s.typeBody}>
        {
          (payType === 'expense' ? expense : income).map(item => <div className={s.typeItem} onClick={() => setCurrentType(item)} key={item.id}>
            <div className={cns({[s.iconfontWrap]: true,[s.expense]: payType === 'expense', [s.income]: payType === 'income' ,[s.active]: currentType.id === item.id})}>
              <span className={`iconfont icon-${fontTypeMap[item.id].icon}`}></span>
            </div>
            <span>{item.name}</span>
          </div>)
        }
      </div>
      <div className={s.remark}>
        {showRemark ? <TextArea
          placeholder='请输入备注信息'
          onBlur={() => setShowRemark(false)}
          autoSize={{ minRows: 3, maxRows: 5 }}
          value={remark}
          onChange={val => {
            setRemark(val)
          }}
        /> : <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>}
      </div>
      <div className={s.timeComponent}>
      <PopupDate onSelect={selectTime} ref={timeRef}></PopupDate>
      </div>
     
      <NumberKeyboard
        visible={show}
        onClose={handleOk}
        onInput={handleInput}
        onDelete={handleDelete}
        showCloseButton={false}
        confirmText='确定'
        customKey={'.'}
        getContainer={null} // 渲染到当前结点下，默认染到document.body下（数字键盘会覆盖日期选择器）
      />
      
      
    </div>
  </Popup>
})

PopupAddBill.propTypes = {
  detail: PropTypes.object,
  onReload: PropTypes.func
}

export default PopupAddBill
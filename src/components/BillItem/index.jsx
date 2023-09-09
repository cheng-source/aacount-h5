import React from "react"
import billStyle from './style.module.less' 
import { Card, Divider } from 'antd-mobile'
import fontTypeMap from "../../utils/fontTypeMap"
import { useState } from "react"
import { useEffect } from "react"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"

const BillItem = function(props) {
  const {bill} = props;
  const [expenseTotal, setExpenseTotal] =  useState(0),
        [incomeTotal, setIncomeTotal] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    const incomeT = bill.bills.filter(item => item.pay_type === 2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncomeTotal(incomeT);
    const expenseT = bill.bills.filter(item => item.pay_type === 1).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpenseTotal(expenseT)
  }, [bill])
        
   return <div className={billStyle.bill}>

    <Card title={bill.date} extra={<>
          <div className={billStyle.money}>
            <span>  
            <span className="iconfont icon-alipay"></span>
              <span>￥{incomeTotal}</span>
            </span>
            <span>  
              <span className="iconfont icon-shouhuoshou--"></span>
              <span>￥{expenseTotal}</span>
            </span>
          </div>
        </>}>
        {bill.bills.map((item, index) => {
        return <div  key={index}  onClick={() => navigate(`detail?id=${item.id}`)}>
        {index !== 0 ? <Divider /> : null}
        <div className={billStyle.item}>
           <div className={billStyle.left}>
             <div className={billStyle.type}>
               <span className={`iconfont icon-${fontTypeMap[item.type_id].icon}`}></span>
               {item.type_name}
             </div>
             <div>
               <span className="time">{dayjs(Number(item.date)).format('HH:mm')}</span>
               {item.remark ? <span>{item.remark}</span> : null}
             </div>
           </div>
           <div className="right" style={{color: item.pay_type === 1 ? '#39be77' : 'red'}}>
           {`${item.pay_type === 1 ? '-' : '+'}${item.amount}`}
          </div>
          </div>
        </div> 
        })}
      </Card>
    </div>
}

export default BillItem
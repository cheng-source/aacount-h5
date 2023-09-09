import React, { useRef, useState } from "react";
import { CalendarOutline } from "antd-mobile-icons";
import { ProgressBar } from "antd-mobile";
import s from './style.module.less'
import PopupDate from "../../components/PopupDate";
import dayjs from "dayjs";
import { useEffect } from "react";
import {get} from '../../utils/index'
import cns from "classnames";
import fontTypeMap from "../../utils/fontTypeMap";

let proportionChart = null;

const Data = function() {
  const monthRef = useRef();
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [totalType, setTotalType] = useState('expense');
  const [pieType, setPieType] = useState('expense'); // 饼图的「收入」和「支出」控制

  const selectMonth = (val) => {
    setMonth(val)
  }

  useEffect(() => {
    getData();
    // return () => {
    //   // 每次组件卸载的时候，需要释放图表实例。clear 只是将其清空不会释放。
    //   proportionChart.dispose();
    // };
  },[month]);
  // 绘制饼图方法
  const setPieChart = (data) => {
    if (window.echarts) {
      // 初始化饼图，返回实例。
      console.log(document.getElementById('proportion'));
      proportionChart = echarts.init(document.getElementById('proportion'));
      console.log(proportionChart);
      proportionChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          // 图例
          legend: {
              data: data.map(item => item.type_name)
          },
          series: [
            {
              name: '支出',
              type: 'pie',
              radius: '55%',
              data: data.map(item => {
                return {
                  value: item.number,
                  name: item.type_name
                }
              }),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
      })
    }
  };

  const getData = async () => {
    const {data} = await get(`/api/bill/data?date=${month}`);
    console.log(data);
    setTotalExpense(data.total_expense)
    setTotalIncome(data.total_income)
    const expense_data = data.total_data.filter(item => item.pay_type === 1).sort((a, b) => b.amount - a.mount);
    const income_data =  data.total_data.filter(item => item.pay_type === 2).sort((a, b) => b.amount - a.mount);
    setExpenseData(expense_data);
    setIncomeData(income_data);
    // setPieChart(pieType == 'expense' ? expense_data : income_data);
  }

  const changeTotalType = (type) => {
    setTotalType(type);
  }
  const changePieType = (type) => {
    setPieType(type);
    // 重绘饼图
    setPieChart(type == 'expense' ? expenseData : incomeData);
  }
  return <div className={s.data}>
      <div className={s.total}>
        <div className={s.time} onClick={() => {monthRef.current && monthRef.current.show()}}>
          <span>{month}</span>
          <CalendarOutline fontSize={16} />
        </div>
        <div className={s.title}>共支出</div>
        <div className={s.expense}>￥{totalExpense}</div>
        <div className={s.income}>共收入￥{totalIncome}</div>
      </div>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth}></PopupDate>

      <div className={s.structure}>
        <div className={s.head}>  
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span onClick={() => changeTotalType('expense')} className={cns({ [s.expense]: true, [s.active]: totalType == 'expense' })}>支出</span>
            <span onClick={() => changeTotalType('income')} className={cns({ [s.income]: true, [s.active]: totalType == 'income' })}>收入</span>
          </div>
        </div>     
        <div className={s.content}>
          {
            (totalType === 'expense' ? expenseData : incomeData).map(item => <div key={item.type_id} className={s.item}>
              <div className={s.left}>
                <div className={s.type}>
                  <div className={cns({ [s.icon]: true, [s.expense]: totalType == 'expense', [s.income]: totalType == 'income' })}>
                    <span className={`iconfont icon-${fontTypeMap[item.type_id].icon}`}></span>
                  </div>
                  <span className={s.name}>{item.type_name}</span>
                </div>
                <div className={s.money}>
                  ￥{Number(item.amount)}
                </div>
              </div>

              <div className={s.right}>
                <ProgressBar percent={Number(Number(item.amount) / Number(totalType === 'expense' ? totalExpense : totalIncome) * 100).toFixed(2)} text />
              </div>
            </div>)
          }
        </div>
      </div>

      <div className={s.structure}>
        <div className={s.head}>  
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span onClick={() => changePieType('expense')} className={cns({ [s.expense]: true, [s.active]: pieType == 'expense'  })}>支出</span>
            <span onClick={() => changePieType('income')} className={cns({ [s.income]: true, [s.active]: pieType == 'income'  })}>收入</span>
          </div>
        </div>     
        {/* 饼图的DOM结点 */}
        <div id="proportion"></div>
      </div>
    
  </div>
}

export default Data
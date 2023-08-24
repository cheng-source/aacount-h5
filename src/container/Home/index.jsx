import React, {useEffect, useState} from "react";
import homeStyle from './style.module.less';
import { DownOutline } from 'antd-mobile-icons';
import BillItem from "../../components/BillItem";
import {get} from '../../utils/index';
import dayjs from "dayjs";

const Home = function() {

  const [list, setList] = useState([]); // 账单列表
  const [page, setPage] = useState(1);
  const [totalExpense, setTotalExpense] = useState();
  const [totalIncome, setTotalIncome] = useState();
  const currentTime = dayjs().format('YYYY-MM')

  useEffect(() => {
    getBillList();
  }, [page])

  const getBillList = async () => {
    const {data} = await get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}`);
    console.log(data);
    setList(data.list)
    setTotalExpense(data.totalExpense)
    setTotalIncome(data.totalIncome)
  }

  return <div className={homeStyle.home}>
    <div className={homeStyle.header}>
      <div className={homeStyle.total}>
        <span className={homeStyle.expense}>总支出：<b>{totalExpense}</b></span>
        <span className={homeStyle.income}>总收入：<b>{totalIncome}</b></span>
      </div>
      <div className={homeStyle.typeSelect}>
        <div className={homeStyle.left}>
          <span>类型</span><DownOutline />
        </div>
        <div className={homeStyle.right}>
          <span>2023-08-11</span><DownOutline />
        </div>
      </div>
    </div>

    <div className={homeStyle.content}>
    {list.map((item, index) => <BillItem key={index} bill={item} />)}
    </div>
    
  </div>
}

export default Home
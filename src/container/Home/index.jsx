import React, {useEffect, useState} from "react";
import homeStyle from './style.module.less';
import { DownOutline } from 'antd-mobile-icons';
import BillItem from "../../components/BillItem";
import {LOAD_STATE, REFRESH_STATE, get} from '../../utils/index';
import dayjs from "dayjs";
import Pull from '../../components/Pull/index'

const Home = function() {
  const [list, setList] = useState([]); // 账单列表
  const [page, setPage] = useState(1);
  const [totalExpense, setTotalExpense] = useState();
  const [totalPage, setTotalPage] = useState(1);
  const [totalIncome, setTotalIncome] = useState();
  const [loadState, setLoadingState] = useState(LOAD_STATE.normal);
  const [refreshState, setRefreshState] = useState(REFRESH_STATE.normal)
  const currentTime = dayjs().format('YYYY-MM')

  useEffect(() => {
    getBillList();
  }, [page])


  const loadingData = () => {
    if (page < totalPage) {
      setLoadingState(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }

  const refreshData = () => {
    setRefreshState(REFRESH_STATE.loading);
    if (page !== 1) {
      setPage(1);
    } else {
      getBillList();
    }

  }

  const getBillList = async () => {
    try {
      const {data} = await get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}`);
      if (page === 1) {
        setList(data.list);
        setRefreshState(REFRESH_STATE.success);
      } else {
        setList(list.concat(data.list));
        setLoadingState(LOAD_STATE.normal);
      }
      setTotalExpense(data.totalExpense);
      setTotalIncome(data.totalIncome);
      setTotalPage(data.totalPage);
    } catch (error) {
      setRefreshState(REFRESH_STATE.fail);
    }

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
    <Pull loadState={loadState} refreshState={refreshState} loadingData={loadingData} refreshData={refreshData} >
    {list.map((item, index) => <BillItem key={index} bill={item} />)}
    </Pull>
    
    </div>
    
  </div>
}

export default Home
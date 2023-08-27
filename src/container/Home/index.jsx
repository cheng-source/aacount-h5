import React, {useEffect, useState, useRef} from "react";
import homeStyle from './style.module.less';
import { DownOutline } from 'antd-mobile-icons';
import BillItem from "../../components/BillItem";
import {LOAD_STATE, REFRESH_STATE, get} from '../../utils/index';
import dayjs from "dayjs";
import Pull from '../../components/Pull/index'
import PopupType from '../../components/PopupType/index'
import PopupDate from "../../components/PopupDate";

const Home = function() {
  const [list, setList] = useState([]); // 账单列表
  const [page, setPage] = useState(1);
  const [totalExpense, setTotalExpense] = useState();
  const [totalPage, setTotalPage] = useState(1);
  const [totalIncome, setTotalIncome] = useState();
  const [loadState, setLoadingState] = useState(LOAD_STATE.normal);
  const [refreshState, setRefreshState] = useState(REFRESH_STATE.normal)
  const typeRef = useRef(); // 账单类型 ref
  const [currentSelect, setCurrentSelect] = useState({}); // 当前筛选类型
  const monthRef = useRef(); //月份
  const [currentTime,setCurrentTime] = useState(dayjs().format('YYYY-MM'));

  useEffect(() => {
    getBillList();
  }, [page, currentSelect,currentTime])

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
      const {data} = await get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${currentSelect.id || 'all'}`);
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

    // 添加账单弹窗
    const toggle = () => {
      typeRef.current && typeRef.current.show()
    };

      // 筛选类型
  const select = (item) => {
    setRefreshState(REFRESH_STATE.loading);
    // 触发刷新列表，将分页重制为 1
    setPage(1);
    setCurrentSelect(item)
  }

  const toggleMonth = () => {
    monthRef.current && monthRef.current.show();
  }

  const selectMonth = (item) => {
    setRefreshState(REFRESH_STATE.loading);
    // 触发刷新列表，将分页重制为 1
    setPage(1);
    setCurrentTime(item)
  }


  return <div className={homeStyle.home}>
    <div className={homeStyle.header}>
      <div className={homeStyle.total}>
        <span className={homeStyle.expense}>总支出：<b>{totalExpense}</b></span>
        <span className={homeStyle.income}>总收入：<b>{totalIncome}</b></span>
      </div>
      <div className={homeStyle.typeSelect}>
        <div className={homeStyle.left} onClick={toggle}>
          <span>{ currentSelect.name || '全部类型' }</span><DownOutline />
        </div>
        <div className={homeStyle.right} onClick={toggleMonth}>
          <span>2023-08-11</span><DownOutline />
        </div>
      </div>
    </div>

    <div className={homeStyle.content}>
    <Pull loadState={loadState} refreshState={refreshState} loadingData={loadingData} refreshData={refreshData} >
    {list.map((item, index) => <BillItem key={index} bill={item} />)}
    </Pull>
    
    </div>
    <PopupType ref={typeRef} onSelect={select} />
    <PopupDate ref={monthRef} onSelect={selectMonth}></PopupDate>
  </div>
}

export default Home
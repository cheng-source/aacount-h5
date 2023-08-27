import React, { useCallback, useEffect, useState } from "react";
import {SpinLoading,DotLoading,ProgressCircle  } from 'antd-mobile'
import { useRef } from "react";
import { LOAD_STATE, REFRESH_STATE, getScrollParent, throttle } from "../../utils";
import s from './style.module.less'

const Pull = function(props) {
  const {refreshData, loadingData, loadState } = props;
  const pullRef = useRef();
  const wrapRef = useRef();
  // const [loading, setLoading] = useState(false);
  const [refreshState, setRefreshState] = useState(props.refreshState);

  const setScrollParent = () => {
    wrapRef.current = getScrollParent(pullRef.current);
  }

  // 节流滚动
  const onScroll = throttle( () => {
    const {scrollHeight, clientHeight} = wrapRef.current;
    if (clientHeight + wrapRef.current.scrollTop + 20 > scrollHeight) {
      // setLoading(true);
      loadingData();
    }
  },500)

  useEffect(() => {
    setRefreshState(props.refreshState);
  }, [props.refreshState])
  
  useEffect(() => {
    setScrollParent();
    wrapRef.current.addEventListener('scroll', onScroll);
    wrapRef.current.addEventListener('touchstart', touchstart);
    wrapRef.current.addEventListener('touchmove', touchmove);
    wrapRef.current.addEventListener('touchend', touchend);
    return () => {
      wrapRef.current.removeEventListener('scroll', onScroll);
      wrapRef.current.removeEventListener('touchstart', touchstart);
      wrapRef.current.removeEventListener('touchmove', touchmove);
      wrapRef.current.removeEventListener('touchend', touchend);
    } 
  }, [wrapRef.current, loadState, props.refreshState]); //props.refreshStat 刷新的时候onScroll也要更新，不然使用的是旧的onScroll

  let startPos = 0,
      transitionHeight = 0;
  const touchstart = (e) => {
    startPos = e.touches[0].pageY;
    wrapRef.current.style.position = 'relative'
    wrapRef.current.style.transition = 'transform 0s';
  }

  const touchmove = throttle( (e) => {
    transitionHeight = e.touches[0].pageY - startPos;
    if (transitionHeight > 0 && transitionHeight < 30 && wrapRef.current.scrollTop === 0) {
      setRefreshState(REFRESH_STATE.pull);
    }
    
  },500)

  const touchend = () => {
    if (wrapRef.current.scrollTop === 0) {
      refreshData();
      wrapRef.current.style.transition = 'transform 0.5s ease 1s';
      wrapRef.current.style.transform = 'translateY(0px)';
    }
  }

  const refreshRender = () => {
    switch (refreshState) {
      case REFRESH_STATE.pull:
        return <div className={s.refreshDiv}>
          <span>释放刷新</span>
        </div>
      case REFRESH_STATE.loading:
        return <div className={s.refreshDiv}>
          <span>加载中</span>
        </div>
      case REFRESH_STATE.success:
        setTimeout(() => {
          setRefreshState(REFRESH_STATE.complete)
        }, 1000)
        return <div className={s.refreshDiv}>
        <span>加载成功</span>
      </div>
      case REFRESH_STATE.complete: 
        return <></>
      case REFRESH_STATE.fail: 
        return <div className={s.refreshDiv}>
          <span>刷新失败</span>
        </div>
    }
  }



  return <div className={s.pull} ref={pullRef}>
      {refreshRender()}
      {props.children}
      {loadState === LOAD_STATE.loading ? <DotLoading /> : null}
  </div>
}

export default Pull;
import React, {useState, useCallback} from "react";
import dayjs from "dayjs";
import { Popup,DatePicker } from 'antd-mobile';
import { forwardRef } from "react";

const PopupDate = forwardRef(function PopupDate({onSelect, mode='day'}, ref) {
  const [show, setShow] = useState(false)

  ref.current = {
    show: () => {
      setShow(true);
    },
    close: () => {
      setShow(false);
    }
  }

  const choseMonth = (item) => {
    if (mode ==='month') {
      onSelect(dayjs(item).format('YYYY-MM'));
    } else if (mode === 'day') {
      onSelect(dayjs(item).format("YYYY-MM-DD"))
    }
    
  }

  const labelRenderer = useCallback((type, data) => {
    switch (type) {
      case 'year':
        return data + '年'
      case 'month':
        return data + '月'
      case 'day':
        return data + '日'
      default:
        return data
    }
  }, [])

  return <DatePicker
              visible={show}
              onClose={() => {
                setShow(false)
              }}
              precision={mode}
              onConfirm={choseMonth}
              renderLabel={labelRenderer}
  />



})

export default PopupDate;
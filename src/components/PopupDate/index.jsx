import React, {useState} from "react";
import dayjs from "dayjs";
import { Popup,DatePicker } from 'antd-mobile';
import { forwardRef } from "react";

const PopupDate = forwardRef(function PopupDate({onSelect}, ref) {
  const [show, setShow] = useState(false)
  const [now, setNow] = useState(new Date())

  ref.current = {
    show: () => {
      setShow(true);
    },
    close: () => {
      setShow(false);
    }
  }

  const choseMonth = (item) => {
    console.log(item);
    setNow(item);
    onSelect(dayjs(item).format('YYYY-MM'));
  }

  return <DatePicker
              visible={show}
              onClose={() => {
                setShow(false)
              }}
              precision='month'
              onConfirm={choseMonth}
            />

})

export default PopupDate;
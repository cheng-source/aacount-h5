import React from "react";
import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";
import { NavBar} from 'antd-mobile'
import s from './style.module.less'

const Header = ({title=''}) => {
  const navigate = useNavigate();

  return <div className={s.header}>
    <NavBar onBack={() => navigate(-1)}>{title}</NavBar>
  </div>
}
Header.propTypes = {
  title: PropTypes.string
}

export default Header;
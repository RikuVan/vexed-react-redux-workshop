import React from 'react'
import PropTypes from 'prop-types'
import './Button.css'
import cx from 'classnames'

const getBtnClasses = (type, className, active) => cx(
  `Button ${type ? 'Button-' + type : ''}`,
  {
    active,
    className
  }
)

const Button = (
  {
    children,
    className,
    htmlType,
    onClick,
    type,
    active,
    ...rest
  },
) => (
  <button
    className={getBtnClasses(type, className, active)}
    onClick={onClick}
    type={htmlType}
    {...rest}
  >
    {children}
  </button>
)

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  htmlType: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool
}

export default Button

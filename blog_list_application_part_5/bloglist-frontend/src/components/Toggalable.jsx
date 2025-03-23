import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
const Toggalable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })
  return (
    <article>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <br />
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </article>
  )
})
Toggalable.displayName = 'Toggalable'
Toggalable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}
export default Toggalable

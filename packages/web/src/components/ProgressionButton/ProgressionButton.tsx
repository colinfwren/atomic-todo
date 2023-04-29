import React from "react";
import styles from './ProgressionButton.module.css'
import {ProgressButtonDirection, ProgressionButtonProps} from "../../types";

/**
 * Get the arrow to show for the given direction
 *
 * @param {ProgressButtonDirection} direction - Direction of the arrow
 * @returns {JSX.Element} - SVG element for the arrow
 */
function getButtonArrow(direction: ProgressButtonDirection): JSX.Element {
  switch(direction){
    case ProgressButtonDirection.BACKWARD:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 18L7 13L13 7" stroke="#F42272" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 18L17 13L11 7" stroke="#F42272" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
  }
}

/**
 * Circular button with arrow, used for changing board timeframe
 *
 * @param {MouseEventHandler<HTMLButtonElement>} onClick - Callback to fire when button is clicked
 * @param {boolean} disabled - If the button is disabled or not
 * @param {ProgressButtonDirection} direction - The direction the button's arrow should face
 * @constructor
 */
export function ProgressionButton({ onClick, disabled, direction}: ProgressionButtonProps): JSX.Element {
  const arrow = getButtonArrow(direction)
  return (
    <button
      className={styles.progressionButton}
      type='button'
      disabled={disabled}
      onClick={onClick}>
      {arrow}
    </button>
  )
}
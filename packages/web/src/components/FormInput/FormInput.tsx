import React from "react";
import { FormInputProps }
  from "../../types";
import styles from './FormInput.module.css'

/**
 * HTML Form Input component with logic to build an accessible form
 *
 * @param {FormInputProps} props - Props passed into the component
 * @param {string} props.fieldId - The ID for the field
 * @param {string} props.label - The Label to show for the field
 * @param {HTMLInputTypeAttribute} props.inputType - The type of the input (text, password etc)
 * @param {boolean} props.isInvalid - If the field should be treated as invalid or not
 * @param {string} props.invalidMessage - The message to show if the field has validation errors
 * @constructor
 */
export function FormInput({ fieldId, label, inputType, isInvalid = false, invalidMessage = '' }: FormInputProps) {
  const hintId = `${fieldId}-hint`
  const invalidProps = isInvalid ? { 'aria-invalid': true, 'aria-describedBy': hintId } : {}
  return (
    <div className={styles.formControl}>
      <label htmlFor={fieldId}>{label}</label>
      <input type={inputType} id={fieldId} {...invalidProps} />
      {isInvalid &&
        <p className="hint" id={hintId}>{invalidMessage}</p>
      }
    </div>
  )
}
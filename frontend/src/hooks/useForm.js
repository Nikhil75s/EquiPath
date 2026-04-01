import { useState, useCallback } from 'react'

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }, [errors])

  const handleBlur = useCallback((e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
  }, [])

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const setMultipleValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const validate = useCallback((validationRules) => {
    const newErrors = {}
    Object.entries(validationRules).forEach(([field, rules]) => {
      for (const rule of rules) {
        const error = rule(values[field], values)
        if (error) {
          newErrors[field] = error
          break
        }
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values])

  return {
    values, errors, touched,
    handleChange, handleBlur, setValue, setMultipleValues,
    setErrors, reset, validate
  }
}

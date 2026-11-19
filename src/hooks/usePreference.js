import { useState } from 'react'

export function usePreference(key, fallback, validate = (value) => value) {
  const [storedPreference] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return {
        value: saved === null ? fallback : validate(saved),
        error: '',
      }
    } catch {
      return { value: fallback, error: 'Preferences could not be loaded or saved in this browser.' }
    }
  })
  const [value, setValue] = useState(storedPreference.value)
  const [error, setError] = useState(storedPreference.error)

  function updateValue(nextValue) {
    const validValue = validate(nextValue)
    setValue(validValue)
    try {
      window.localStorage.setItem(key, validValue)
      setError('')
    } catch {
      setError('Preferences could not be saved in this browser.')
    }
  }

  return [value, updateValue, error]
}

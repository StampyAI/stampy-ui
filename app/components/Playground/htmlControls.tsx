import {ChangeEvent, useState} from 'react'

type Parseable = string | number | undefined
type NumberParser = (v: Parseable) => number

type InputFields = {
  field: string
  label: string
  value?: Parseable
  min?: string | number
  max?: string | number
  step?: string | number
  parser?: NumberParser
  updater: (v: any) => any
}

const between =
  (
    min: Parseable,
    max: Parseable,
    parser: NumberParser,
    updater: (v: any) => any,
    cacher: (v: any) => any
  ) =>
  (event: ChangeEvent) => {
    let num = parser((event.target as HTMLInputElement).value)
    if (isNaN(num)) {
      cacher((event.target as HTMLInputElement).value)
      return
    } else if (min !== undefined && num < parser(min)) {
      num = parser(min)
    } else if (max !== undefined && num > parser(max)) {
      num = parser(max)
    }
    cacher(null)
    updater(num)
  }

export const SectionHeader = ({text}: {text: string}) => (
  <h4 style={{gridColumn: 'span 4', fontSize: '1.125rem', fontWeight: 600}}>{text}</h4>
)

export const NumberInput = ({
  field,
  value,
  label,
  min,
  max,
  updater,
  parser = (v) => parseInt(v as string, 10),
}: InputFields) => {
  const [internalValue, setInternalValue] = useState(null)
  return (
    <>
      <label htmlFor={field} style={{gridColumn: 'span 3', display: 'inline-block'}}>
        {label}
        {internalValue !== null ? ' (invalid input)' : ''}:{' '}
      </label>
      <input
        name={field}
        value={internalValue !== null ? internalValue : value}
        style={{width: '80px'}}
        onChange={between(min, max, parser, updater, setInternalValue)}
        type="number"
      />
    </>
  )
}

export const Slider = ({
  field,
  value,
  label,
  min = 0,
  max = 1,
  step = 0.01,
  parser = (v) => parseFloat(v as string),
  updater,
}: InputFields) => (
  <>
    <label htmlFor={field} style={{gridColumn: 'span 2'}}>
      {label}:
    </label>
    <input
      name={field}
      style={{gridColumn: 'span 2'}}
      value={value}
      onChange={between(min, max, parser, updater, (x) => null)}
      type="range"
      min={min}
      max={max}
      step={step}
    />
  </>
)

export const Checkbox = ({
  field,
  checked,
  label = '',
  updater,
}: InputFields & {checked: boolean}) => (
  <>
    <label htmlFor={field} style={{gridColumn: 'span 2'}}>
      {label}:
    </label>
    <input
      name={field}
      style={{gridColumn: 'span 2'}}
      checked={checked}
      onChange={(event: ChangeEvent) => updater((event.target as HTMLInputElement).checked)}
      type="checkbox"
    />
  </>
)

export const Select = ({
  name,
  value,
  options,
  updater,
}: {
  name: string
  value: string
  options: string[]
  updater: (v: any) => any
}) => (
  <select name={name} value={value} onChange={updater} style={{gridColumn: 'span 2'}}>
    {options.map((option: string) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
)

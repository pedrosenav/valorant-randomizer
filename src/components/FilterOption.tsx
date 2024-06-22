import { FieldValues, Ref, UseFormRegister } from 'react-hook-form'

interface FilterOptionProps {
  name: string
  value: string
  ref: 
  displayName: string
  registerFn: UseFormRegister<FieldValues>
}

export default function FilterOption({
  name,
  value,
  displayName,
  ref,
}: FilterOptionProps) {
  return (
    <div className="flex items-center gap-2.5">
      <input
        className="bg-gray-800 accent-emerald-400"
        defaultChecked={true}
        value={value}
        id={value}
        name={name}
        ref={ref}
        type="checkbox"
      />
      <label
        htmlFor={name}
        className="cursor-pointer text-xl font-semibold uppercase"
      >
        {displayName}
      </label>
    </div>
  )
}

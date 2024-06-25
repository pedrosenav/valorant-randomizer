import { useFormContext } from 'react-hook-form'

interface AgentFilterProps {
  roleId: string
  roleName: string
}

export default function AgentFilter({ roleId, roleName }: AgentFilterProps) {
  const { register } = useFormContext()
  return (
    <label
      htmlFor={roleId}
      className="flex cursor-pointer items-center gap-2.5 rounded px-4 py-2.5 font-semibold uppercase transition-colors hover:bg-gray-800 has-[:checked]:bg-gray-800"
    >
      <input
        className="bg-gray-800 accent-emerald-400"
        defaultChecked={true}
        value={roleId}
        id={roleId}
        type="checkbox"
        {...register('roles')}
      />
      {roleName}
    </label>
  )
}

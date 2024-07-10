import { Role } from '@/app/agent/page'
import Image from 'next/image'
import { useFormContext } from 'react-hook-form'

interface AgentFilterProps {
  role: Role
}

export default function AgentFilter({ role }: AgentFilterProps) {
  const { register } = useFormContext()
  return (
    <label
      htmlFor={role.displayName}
      className="flex min-w-40 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-gray-800 has-[:checked]:bg-emerald-600"
    >
      <input
        className="peer hidden"
        defaultChecked={true}
        value={role.displayName}
        id={role.displayName}
        type="checkbox"
        {...register('roles')}
      />

      <Image
        src={role.displayIcon}
        alt={`${role.displayName} Icon`}
        width={16}
        height={16}
        draggable={false}
        className="opacity-25 transition-all peer-checked:opacity-100"
      />

      {role.displayName}
    </label>
  )
}

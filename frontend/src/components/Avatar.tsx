interface AvatarProps {
  name: string;
}

export function Avatar({ name }: AvatarProps) {
  return <div className="relative inline-flex items-center justify-center w-6 h-6 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
  <span className="font-medium text-gray-600 dark:text-gray-300">
    {name.split(" ")[0][0]}
  </span>
</div>
}
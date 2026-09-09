import React from 'react'
import { Outlet } from 'react-router'

const TaskLayout = () => {
  return (
    <div className="flex-1 pl-3 pr-3 pt-4 pb-5 bg-gray-50 dark:bg-[#141414]">
      <Outlet />
    </div>
  )
}

export default TaskLayout
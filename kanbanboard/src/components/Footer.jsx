import { useSelector } from 'react-redux'

const Footer = () => {

  const columns = useSelector((state) => state.kanban.columns);

  const totalTasks = Object.values(columns).reduce((acc, column) => acc + column.tasks.length, 0);

  const completedTasks = columns['done']?.tasks.length || 0;

  const progressPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <footer className='bg-gray-800 text-white p-4 fixed bottom-0 w-[1300px]'>
      <div className='flex flex-col sm:flex-row sm:justify-between gap-2 max-w-screen-lg mx-auto items-center'>
        <div>
          <p className='text-sm'>
            Completed {completedTasks} out of {totalTasks} tasks
          </p>
        </div>
        <div className='w-2/3 bg-gray-700 rounded-full h-4'>
          <div className='bg-green-500 h-4 rounded-full' style={{width: `${progressPercentage}%`}}></div>
        </div>
        <div>
          <p className='text-sm'>{progressPercentage}%</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
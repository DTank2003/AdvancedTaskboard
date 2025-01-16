import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from './components/pages/AdminDashboard';
import UserDashboard from "./components/pages/UserDashboard";
import { useState } from 'react';
import AdminTasks
 from './components/pages/AdminTasks';
import ManagerDashboard from './components/pages/ManagerDashboard';
import ProjectTasks from './components/pages/ProjectTasks';

const App = () => {

  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  // const columns = useSelector((state) => state.kanban.columns);
  // const searchQuery = useSelector((state) => state.kanban.searchQuery);
  // const priorityFilter = useSelector((state) => state.kanban.priorityFilter);
  // const dispatch = useDispatch();
  // const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  // const [task, setTask] = useState('');
  // const [description, setDescription] = useState('');
  // const [dueDate, setDueDate] = useState('');
  // const [priority, setPriority] = useState('Medium');
  // const [selectedColumn, setSelectedColumn] = useState(Object.keys(columns)[0]);
  // const [warningMessage, setWarningMessage] = useState('');

  // const handleSearchChange = (e) => {
  //   dispatch(setSearchQuery(e.target.value.toLowerCase()));
  // };

  // const handleFilter = (e) => {
  //   dispatch(setPriorityFilter(e.target.value));
  // };

  // const handleAddTask = (e) => {
  //   e.preventDefault();
  //   const allTasks = Object.values(columns).flatMap(column => column.tasks);
  //   const isDuplicate = allTasks.some(existingTask => existingTask.content.toLowerCase() === task.toLowerCase());

  //   if (isDuplicate) {
  //     setWarningMessage('A task with the same title already exists.');
  //     return;
  //   }

  //   if (task.trim()) {
  //     dispatch(addTask({
  //       columnId: selectedColumn,
  //       task: {
  //         id: `task-${Date.now()}`,
  //         content: task,
  //         description,
  //         dueDate,
  //         priority
  //       }
  //     }));
  //     setTask('');
  //     setDescription('');
  //     setDueDate('');
  //     setPriority('Medium');
  //     setIsAddTaskModalOpen(false);
  //     setWarningMessage('');
  //   }
  // };

  // const onDragEnd = (result) => {
  //   const { source, destination } = result;

  //   if (!destination) return;

  //   if (
  //     source.droppableId === destination.droppableId &&
  //     source.index === destination.index
  //   )
  //     return;

  //   const sourceColumn = columns[source.droppableId];
  //   const destinationColumn = columns[destination.droppableId];

  //   const sourceTasks = Array.from(sourceColumn.tasks);
  //   const destinationTasks = Array.from(destinationColumn.tasks);

  //   const [movedTask] = sourceTasks.splice(source.index, 1);

  //   if (source.droppableId === destination.droppableId) {
  //     sourceTasks.splice(destination.index, 0, movedTask);
  //     const updatedColumn = {
  //       ...sourceColumn,
  //       tasks: sourceTasks,
  //     };

  //     const updatedColumns = {
  //       ...columns,
  //       [source.droppableId]: updatedColumn,
  //     };

  //     dispatch(updateColumns(updatedColumns));
  //   } else {
  //     destinationTasks.splice(destination.index, 0, movedTask);

  //     const updatedColumns = {
  //       ...columns,
  //       [source.droppableId]: {
  //         ...sourceColumn,
  //         tasks: sourceTasks,
  //       },
  //       [destination.droppableId]: {
  //         ...destinationColumn,
  //         tasks: destinationTasks,
  //       },
  //     };

  //     dispatch(updateColumns(updatedColumns));
  //   }
  // };

  // return (
  //   <>
  //     <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
  //       <div className="flex justify-between items-center">
  //         <h1 className="text-xl font-bold">KANBAN BOARD</h1>
  //         <div className="flex gap-4">
  //           <input
  //             type="text"
  //             placeholder="Search for tasks..."
  //             value={searchQuery}
  //             onChange={handleSearchChange}
  //             className="border rounded-md px-4 py-2 w-64"
  //           />
  //           <select onChange={handleFilter} className="border rounded-md px-4 py-2">
  //             <option value="">All</option>
  //             <option value="High">High</option>
  //             <option value="Medium">Medium</option>
  //             <option value="Low">Low</option>
  //           </select>
  //           <button
  //             onClick={() => setIsAddTaskModalOpen(true)}
  //             className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600"
  //           >
  //             Add Task
  //           </button>
  //         </div>
  //       </div>
  //       <DragDropContext onDragEnd={onDragEnd}>
  //         <div className="flex flex-row overflow-x-auto space-x-4 mt-8">
  //           {Object.entries(columns).map(([columnId, column]) => (
  //             <Column
  //               key={columnId}
  //               columnId={columnId}
  //               title={column.title}
  //               tasks={column.tasks.filter(task => 
  //                 (priorityFilter === '' || task.priority === priorityFilter) &&
  //                 (searchQuery === '' || task.content.toLowerCase().includes(searchQuery))
  //               )}
  //             />
  //           ))}
  //         </div>
  //       </DragDropContext>
  //       <div className="flex justify-center mt-auto">
  //         <Footer />
  //       </div>
  //     </div>

  //     {isAddTaskModalOpen && (
  //       <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
  //         <div className='bg-white p-6 rounded-md'>
  //           <h2 className='text-lg font-semibold mb-4'>Add Task</h2>
  //           <form onSubmit={handleAddTask}>
  //             <div className='mb-4'>
  //               <input
  //                 type='text'
  //                 value={task}
  //                 onChange={(e) => setTask(e.target.value)}
  //                 placeholder='New Task...'
  //                 className='border border-gray-300 rounded p-2 w-full'
  //               />
  //               <input
  //                 type='text'
  //                 value={description}
  //                 onChange={(e) => setDescription(e.target.value)}
  //                 placeholder='Description...'
  //                 className='border border-gray-300 rounded p-2 w-full mt-2'
  //               />
  //               <input
  //                 type='date'
  //                 value={dueDate}
  //                 onChange={(e) => setDueDate(e.target.value)}
  //                 className='border border-gray-300 rounded p-2 w-full mt-2'
  //               />
  //               <select
  //                 value={priority}
  //                 onChange={(e) => setPriority(e.target.value)}
  //                 className='border border-gray-300 rounded p-2 w-full mt-2'
  //               >
  //                 <option value='High'>High</option>
  //                 <option value='Medium'>Medium</option>
  //                 <option value='Low'>Low</option>
  //               </select>
  //               <select
  //                 value={selectedColumn}
  //                 onChange={(e) => setSelectedColumn(e.target.value)}
  //                 className='border border-gray-300 rounded p-2 w-full mt-2'
  //               >
  //                 {Object.entries(columns).map(([columnId, column]) => (
  //                   <option key={columnId} value={columnId}>{column.title}</option>
  //                 ))}
  //               </select>
  //             </div>
  //             {warningMessage && <p className='text-red-500 mb-4'>{warningMessage}</p>}
  //             <div className='flex justify-end'>
  //               <button type='button' onClick={() => setIsAddTaskModalOpen(false)} className='bg-gray-500 text-white rounded py-2 px-4 mr-2'>
  //                 Cancel
  //               </button>
  //               <button type='submit' className='bg-blue-500 text-white rounded py-2 px-4'>
  //                 Add Task
  //               </button>
  //             </div>
  //           </form>
  //         </div>
  //       </div>
  //     )}
  //   </>
  // );
  return (                                   
    <Router>
      <Routes>
        <Route path="/" element={<Login setAuthToken={setAuthToken}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path = "/admin/dashboard/projects/:projectId/tasks"
                element = {<AdminTasks />} />
        <Route path="/projects/:projectId/tasks" element={<ProjectTasks />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  ) 
};

export default App;
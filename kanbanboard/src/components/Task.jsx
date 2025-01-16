import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { deleteTask, editTask } from '../features/kanbanSlice';
import { format, isPast, isToday } from 'date-fns';

const Task = ({ columnId, task, index }) => {
    const { id, content, description, dueDate, priority } = task;
    const priorityColors = {
        High: 'bg-red-400',
        Medium: 'bg-yellow-400',
        Low: 'bg-green-400',
    };

    const dispatch = useDispatch();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newContent, setNewContent] = useState(content);
    const [newDescription, setNewDescription] = useState(description);
    const [newDueDate, setNewDueDate] = useState(dueDate);
    const [newPriority, setNewPriority] = useState(priority);

    const handleDeleteTask = () => {
        dispatch(deleteTask({ columnId, taskId: id }));
    };

    const handleEditTask = () => {
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        dispatch(editTask({ columnId, taskId: id, newContent, newDescription, newDueDate, newPriority }));
        setIsEditModalOpen(false);
    };

    const isDueDatePassed = dueDate && isPast(new Date(dueDate)) && !isToday(new Date(dueDate));

    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    className='border rounded-md p-3 bg-gray-50 flex items-center justify-between'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div>
                        <p className='font-medium text-gray-800'>{content} {isDueDatePassed && <span className='text-red-500 ml-2'>(Due date passed!)</span>}</p>
                        {description && <p className='text-sm text-gray-600'>{description}</p>}
                        {dueDate && (
                            <p className='text-sm text-gray-600'>
                                Due: {format(new Date(dueDate), 'yyyy-MM-dd')}
                            </p>
                        )}
                        <span className={`inline-block mt-2 text-sm px-2 py-1 rounded-md text-white ${priorityColors[priority]}`}>
                            {priority}
                        </span>
                    </div>
                    <div className='flex flex-col'>
                        <button onClick={handleEditTask} className='text-blue-500 hover:text-blue-700 text-sm'>
                            EDIT
                        </button>
                        <button onClick={handleDeleteTask} className='text-red-500 hover:text-red-700 text-sm'>
                            DELETE
                        </button>
                    </div>

                    {isEditModalOpen && (
                        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
                            <div className='bg-white p-6 rounded-md'>
                                <h2 className='text-lg font-semibold mb-4'>Edit Task</h2>
                                <form onSubmit={handleEditSubmit}>
                                    <div className='mb-4'>
                                        <input
                                            type='text'
                                            value={newContent}
                                            onChange={(e) => setNewContent(e.target.value)}
                                            className='border border-gray-300 rounded p-2 w-full'
                                        />
                                        <input
                                            type='text'
                                            value={newDescription}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            className='border border-gray-300 rounded p-2 w-full mt-2'
                                        />
                                        <input
                                            type='date'
                                            value={newDueDate}
                                            onChange={(e) => setNewDueDate(e.target.value)}
                                            className='border border-gray-300 rounded p-2 w-full mt-2'
                                        />
                                        <select
                                            value={newPriority}
                                            onChange={(e) => setNewPriority(e.target.value)}
                                            className='border border-gray-300 rounded p-2 w-full mt-2'
                                        >
                                            <option value='High'>High</option>
                                            <option value='Medium'>Medium</option>
                                            <option value='Low'>Low</option>
                                        </select>
                                    </div>
                                    <button type='submit' className='bg-blue-500 text-white rounded py-2 px-4'>
                                        Save
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};

Task.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        description: PropTypes.string,
        dueDate: PropTypes.string,
        priority: PropTypes.oneOf(['High', 'Medium', 'Low']).isRequired,
    }).isRequired,
    columnId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
};

export default Task;
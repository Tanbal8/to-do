import React, { useContext, useReducer, useRef } from "react";
import TaskItemIcon from "../task-item-option/TaskItemOption";
import TaskItemReducer from '../../../../reducer/TaskItemReducer';
import GlobalContext from "../../../../contexts/GlobalContext";
import ToDoContext from "../../../../contexts/ToDoContext";
import { onDragEnd, onDragOver, onDragStart, onDrop } from "../../../../utils/drag";
import { focusInput } from "../../../../utils/input";
import { FiEdit2 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";
import './task-item.css';

const TaskItem = ({ task }) => {
  const { notification } = useContext(GlobalContext);
  const { tasks, globalDispatch, listOptionsRef, activeListFilter, themeMode } = useContext(ToDoContext);
  const [state, dispatch] = useReducer(TaskItemReducer, {
    isEditing: false,
    isDeleting: false,
  });
  const taskItemRef = useRef(null);
  const taskTextRef = useRef(null);

  const changeStatus = () => {
    globalDispatch({
      type: 'CHANGE_STATUS',
      task,
    });
  }

  const deleteHandler = () => {
    if (state.isDeleting) return; // Prevent of several clicks on delete button
    dispatch({
      type: 'DELETE',
    });
    // Successful deleting
    // Animation of deleting task
    if (tasks.length === 1 && // Check if deleting the last task 
      listOptionsRef && // List options ref validation
      listOptionsRef.current
    ) listOptionsRef.current.style.visibility = 'hidden'; // Hide list option ref
    taskItemRef.current.style.marginTop = `${-taskItemRef.current.offsetHeight}px`;
    taskItemRef.current.style.transform = 'scale(0)';
    taskItemRef.current.style.opacity = 0;
    new notification('success', 'Task deleted!');
    // Updating tasks state after 200ms for animation
    setTimeout(() => {
      globalDispatch({
        type: 'DELETE_TASK',
        task,
      });
    }, 200);
  }

  const editHandler = () => {
    if (state.isEditing) return;
    dispatch({ type: 'CHANGE_IS_EDITING' });
    focusInput(taskTextRef?.current);
  }
  
  const confirmEditHandler = () => {
    if (!taskTextRef || !taskTextRef.current) { // Problem with ref
      new notification('alert', 'Error');
      return;
    }
    const newTask = taskTextRef.current.value.trim();
    if (newTask === '') { // Empty input
      new notification('alert', 'Error', 'Enter a task!');
      focusInput(taskTextRef?.current);
      return;
    }
    taskTextRef.current.value = newTask; // Removing additional spaces
    if (newTask === task.task) { // Message for repeated valuee
      new notification('message', 'You didn\'t change the task!');
      dispatch({ type: 'CHANGE_IS_EDITING' });
      return;
    }
    // Successful editing
    dispatch({ type: 'CHANGE_IS_EDITING' }); // Changing isEditing state
    globalDispatch({ // Changing task data
      type: 'EDIT_TASK',
      task,
      newTask,
    });
    new notification('success', 'Task edited!');
  }

  const taskTextKeyDownHanlder = e => {
    if (e.key === 'Enter' && state.isEditing) confirmEditHandler();
  }
  
  const reOrderHandler = (fromId, toId) => {
    const fromIndex = tasks.findIndex(taskItem => taskItem.id === fromId);
    const toIndex = tasks.findIndex(taskItem => taskItem.id === toId);
    if (fromIndex === toIndex) return;
    globalDispatch({
      type: 'CHANGE_TASK_ORDER',
      from: fromIndex,
      to: toIndex,
    });
  }

  const onContextMenu = (e) => {
    console.log(e);
    e.preventDefault();
  }

  return (
    <li
      className={`task-item ${task.done ? 'task-done' : ''}`}
      ref={taskItemRef}
      draggable={activeListFilter === 'All'}
      onDragStart={e => { onDragStart(e, task.id)}}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={e => { onDrop(e, task.id, reOrderHandler) }}
      onContextMenu={onContextMenu}
      data-theme-mode={themeMode}
    >
      <div className="task-item-checkbox-container">
        <button // The circle checkbox
          className='task-item-checkbox'
          onClick={changeStatus}
        >
          { task.done && // Checkmark if the task is done
            <FiCheck size={22} />
          }
        </button>
      </div>
      <div className="task-item-content-container">
        <input
          className="task-item-task"
          ref={taskTextRef}
          defaultValue={task.task}
          onKeyDown={taskTextKeyDownHanlder}
          onDoubleClick={editHandler}
          readOnly={!state.isEditing}
          name="task-item-task"
          maxLength={40}
        />
        <div className="task-item-dates">
          {
            task.lastEditDate ?
              <div className="task-item-edit-date">
                <FiEdit2 />
                { [task.lastEditDate.year, task.lastEditDate.month.padStart(2, '0'), task.lastEditDate.day.padStart(2, '0')].join('/') }
              </div>
            : <div className="task-item-create-date">
                { [task.createDate.year, task.createDate.month.padStart(2, '0'), task.createDate.day.padStart(2, '0')].join('/') }
            </div>
          }
        </div>
      </div>
      <div className="task-item-options">
        {
          state.isEditing ?
            <TaskItemIcon id='confirm-edit' onClick={confirmEditHandler}> {/* Confirm edit task */}
              <FiCheckCircle size={18} />
            </TaskItemIcon>
            :
            <>
              <TaskItemIcon id='delete' onClick={deleteHandler}> {/* Delett task */}
                <FiTrash2 size={18} />
              </TaskItemIcon>
              <TaskItemIcon id='edit' onClick={editHandler}> {/* Edit task */}
                <FiEdit2 size={18} />
              </TaskItemIcon>
            </>
        }
      </div>
    </li>
  );
}

export default TaskItem;
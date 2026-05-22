import { useEffect, useReducer, useRef } from "react";
import AddTaskForm from "./cmoponents/add-task-form/AddTaskForm";
import TaskList from "./cmoponents/task-list/TaskList";
import GoToTopButton from "../../components/go-to-top-button/GoToTopButton";
import DarkModeButton from "../../components/dark-mode-button/DarkModeButton";
import { onDragOver, onDrop } from '../../utils/drag';
import ToDoContext from "../../contexts/ToDoContext";
import ToDoReducer from "../../reducer/ToDoReducer";
import './to-do.css';

const ToDo = () => {
  const listFilters = [
    {
      name: 'All',
    },
    {
      name: 'To Do',
      attributes: {
        'onDragOver': onDragOver,
        'onDrop': e => onDrop(e, null, onToDoButtonDrop),
      },
    },
    {
      name: 'Done',
      attributes: {
        'onDragOver': onDragOver,
        'onDrop': e => onDrop(e, null, onDoneButtonDrop),
      },
    }
      
  ];
  const [state, dispatch] = useReducer(ToDoReducer, {
      tasks: (localStorage.getItem('to-do-tasks') && JSON.parse(localStorage.getItem('to-do-tasks'))) || [],
      activeListFilter: listFilters[0].name || 'All',
      themeMode: localStorage.getItem('to-do-theme-mode') || 'light',
  });
  const taskListRef = useRef(null);
  const listOptionsRef = useRef(null);

  const onToDoButtonDrop = (id) => {
      dispatch({
        type: 'CHANGE_STATUS',
        task: state.tasks.find(task => task.id === id),
        newStatus: false,
    })
  }

  const onDoneButtonDrop = (id) => {
      dispatch({
        type: 'CHANGE_STATUS',
        task: state.tasks.find(task => task.id === id),
        newStatus: true,
    })
  }

  const darkModeButtonClickHandler = newThemeMode => {
    dispatch({
      type: 'CHANGE_THEME_MODE',
      newThemeMode,
    });
    localStorage.setItem('to-do-theme-mode', newThemeMode);
  }

  useEffect(() => {
    localStorage.setItem('to-do-tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  return (
    <ToDoContext value={{
      tasks: state.tasks,
      globalDispatch: dispatch,
      activeListFilter: state.activeListFilter,
      listFilters,
      taskListRef,
      listOptionsRef,
      themeMode: state.themeMode,
    }}>
      <div id="to-do-page" data-theme-mode={state.themeMode}>
        <AddTaskForm />
        <TaskList />
        <GoToTopButton />
        <DarkModeButton themeMode={state.themeMode} callback={darkModeButtonClickHandler} />
      </div>
    </ToDoContext>
  );
}

// This is just for test
// const defaultTasks = [
//   {
//     id: 1,
//     task: 'Walking',
//     done: true,
//   },
//   {
//     id: 2,
//     task: 'Study',
//     done: false,
//   },
//   {
//     id: 3,
//     task: 'Reading book',
//     done: true,
//   },
//   {
//     id: 4,
//     task: 'Brushing teeth',
//     done: false,
//   },
//   {
//     id: 5,
//     task: 'Doing exercise',
//     done: false,
//   },
// ];

export default ToDo;
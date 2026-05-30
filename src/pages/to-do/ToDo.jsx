import { useEffect, useRef, useState } from "react";
import { useLocalStorage, useTasksManager } from "../../hooks/customHooks";
import AddTaskForm from "./cmoponents/add-task-form/AddTaskForm";
import TaskList from "./cmoponents/task-list/TaskList";
import GoToTopButton from "../../components/go-to-top-button/GoToTopButton";
import DarkModeButton from "../../components/dark-mode-button/DarkModeButton";
import { onDragOver, onDrop } from '../../utils/drag';
import ToDoContext from "../../contexts/ToDoContext";
import './to-do.scss';

const ToDo = () => {
  const [tasks, tasksOperations] = useTasksManager('to-do-tasks', []);
  const [themeMode, setThemeMode] = useLocalStorage('to-do-theme-mode', 'light');
  const listFilters = [
    {
      name: 'All',
    },
    {
      name: 'To Do',
      attributes: {
        'onDragOver': onDragOver,
        'onDrop': e => onDrop(e, null, (id) => tasksOperations.changeStatus(id, false)),
      },
    },
    {
      name: 'Done',
      attributes: {
        'onDragOver': onDragOver,
        'onDrop': e => onDrop(e, null, (id) => tasksOperations.changeStatus(id, true)),
      },
    }
  ];
  const [activeListFilter, setActiveListFilter] = useState(listFilters[0].name || 'All');
  const taskListRef = useRef(null);
  const listOptionsRef = useRef(null);

  const darkModeButtonClickHandler = newThemeMode => {
    setThemeMode(newThemeMode);
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme-mode', themeMode);
  }, [themeMode]);

  return (
    <ToDoContext value={{
      tasks,
      tasksOperations,
      activeListFilter,
      setActiveListFilter,
      listFilters,
      taskListRef,
      listOptionsRef,
      themeMode,
      setThemeMode,
    }}>
      <div id="to-do-page">
        <AddTaskForm />
        <TaskList />
        <GoToTopButton />
        <DarkModeButton themeMode={themeMode} callback={darkModeButtonClickHandler} />
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
import { useContext, useEffect, useState } from "react";
import ListOptions from "../list-options/ListOptions";
import TaskItem from "../task-item/TaskItem";
import ToDoContext from "../../../../contexts/ToDoContext";
import './task-list.scss';

const TasksList = () => {
  const { tasks, activeListFilter, taskListRef } = useContext(ToDoContext);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [noTasksContent, setNoTasksContent] = useState('');

  useEffect(() => {
    switch (activeListFilter) {
      case 'All':
        setFilteredTasks(tasks);
        setNoTasksContent('No tasks found!');
        break;
      case 'Done':
        setFilteredTasks(tasks.filter(task => task.done));
        setNoTasksContent('No tasks done!');
        break;
      case 'To Do':
        setFilteredTasks(tasks.filter(task => !task.done));
        setNoTasksContent('Nothing to do!');
        break;
      default:
        setFilteredTasks([]);
        setNoTasksContent('No tasks found!');
        break;
    }
  }, [tasks, activeListFilter]);
  

  return tasks?.length > 0 ?
    <>
      <ListOptions />
      {
        filteredTasks?.length > 0 ?
          <ul id="task-list" ref={taskListRef}>
            {
              filteredTasks.map(task => (
                <TaskItem task={task} key={task.id} />
              ))
            }
          </ul>
          : <div id='empty-list'>{ noTasksContent }</div>
      }
      </>
    : // no tasks found
    <div id='empty-list'>No tasks found!</div>
}

export default TasksList;
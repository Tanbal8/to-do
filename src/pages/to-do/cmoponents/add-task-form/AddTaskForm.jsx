import { useContext, useRef } from "react";
import GlobalContext from "../../../../contexts/GlobalContext";
import ToDoContext from "../../../../contexts/ToDoContext";
import './add-task-form.scss';

const AddTaskForm = () => {
  const { notification } = useContext(GlobalContext);
  const { tasksOperations } = useContext(ToDoContext);
  const inputRef = useRef(null);
  const buttonClickHandler = e => {
    e.preventDefault(); // prevent of submiting
    if (!inputRef || !inputRef.current) { // problem with ref
      new notification('alert', 'Error', 'Couldn\'t add the task');
      return;
    };
    const newTask = inputRef.current.value.trim();
    if (newTask === '') { // empty input
      new notification('alert', 'Error', 'Task input is empty!');
      inputRef.current.value = '';
      inputRef.current.focus();
      return;
    };
    tasksOperations.add({
      task: newTask,
      done: false,
    });
    inputRef.current.value = '';
    inputRef.current.focus();
    new notification('success', 'Task Added!');
  }

  const inputKeyDownHandler = e => {
    if (e.key === 'Enter') buttonClickHandler(e);
  }

  return (
    <form id='add-task-form'>
      <input
        type="text"
        id='add-task-input'
        placeholder="Add your task..."
        onKeyDown={inputKeyDownHandler}
        ref={inputRef}
        maxLength={40}
      />
      <button
        onClick={buttonClickHandler}
        type="button"
        id="add-task-button"
      >Add Task</button>
    </form>
  );
}

export default AddTaskForm;
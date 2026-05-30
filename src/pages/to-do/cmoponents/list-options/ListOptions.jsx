import { useContext } from "react";
import { FaFilter } from "react-icons/fa";
import { MdSort } from 'react-icons/md';
import GlobalContext from "../../../../contexts/GlobalContext";
import ToDoContext from "../../../../contexts/ToDoContext";
import './list-options.scss';

const ListOptions = () => {
    const { notification } = useContext(GlobalContext);
    const { tasks, tasksOperations, activeListFilter, setActiveListFilter, listFilters, taskListRef, listOptionsRef } = useContext(ToDoContext);

    const doAllTheTasks = () => { // Do all the tasks
        if (tasks.every(task => task.done)) {
            new notification('message', 'All tasks are already done!');
            return;
        }
        tasksOperations.doAll();
        new notification('success', 'Good job!', 'You finished all the tasks.');
    }

    const deleteTasksWhere = (condition = () => true, successNotification = '', noTasksnotification = '') => { // Delete tasks with a special condition
        let delay;
        const filteredTasks = tasks.filter(task => condition(task));
        if (filteredTasks.length === 0) {
            new notification('message', noTasksnotification)
            return;
        }
        if (filteredTasks.length === tasks.length && listOptionsRef && listOptionsRef.current) { // Checking for deleting all the tasks
            listOptionsRef.current.style.visibility = 'hidden'; // Hide the list options if the task list will be empty
        }
        if (!taskListRef || !taskListRef.current) delay = 0;
        else {
            const TaskList = taskListRef.current.children;
            const filteredTaskList = [...TaskList].filter((_, index) => condition(tasks[index]));
            for (const task of filteredTaskList) task.classList.add('task-item-delete');
            delay = 200;
        }
        setTimeout(() => {
            for (const task of filteredTasks) tasksOperations.remove(task.id);
        }, delay);
        new notification('success', successNotification);
    }

    const ListOptionsButtons = [
        {
            name: 'Do All',
            onClick: doAllTheTasks,
        },
        {
            name: 'Delete All',
            onClick: () => deleteTasksWhere(() => true, 'All tasks deleted!', 'No tasks found!'),
        },
        {
            name: 'Delete Done',
            onClick: () => deleteTasksWhere(task => task.done, 'Done tasks deleted!', 'No done tasks found!'),
        },
    ];

    const tasksCount = tasks.length;
    const doneTasksCount = tasks.filter(task => task.done).length;

    return (
        <div id="list-options" ref={listOptionsRef}>
            <div id='list-filter-container'>
                <FaFilter />
                <ul id="list-filter-list">
                {
                    listFilters.map(filter => (
                        <li key={filter.name}>
                            <button
                                className={filter.name === activeListFilter ? 'active-list-filter' : ''}
                                onClick={() => { setActiveListFilter(filter.name) }}
                                { ...filter.attributes }
                            >
                                { filter.name }
                            </button>
                        </li>
                    ))
                }
                </ul>
            </div>
            <div id="list-sort-container">
                <MdSort size={22} />
                <ul id="list-sort-list">
                {
                    sortList.map(sort => (
                        <li key={`sortBy-${sort.name}`}>
                            <button
                                onClick={() => tasksOperations.sort(sort.sortBy)}
                            >{ sort.name }</button>
                        </li>
                    ))
                }
                </ul>
            </div>
            <div id="list-options-buttons-container">
                <ul id='list-options-buttons'>
                    {
                        ListOptionsButtons.map((button, index) => (
                            <li key={`button-${index}`}>
                                <button
                                    onClick={button.onClick || (() => {})}
                                    { ...button.attributes }
                                >{ button.name }</button>
                            </li>
                        ))
                    }
                </ul>
            </div>
            { tasksCount > 0 &&
                <div id="tasks-info">
                    <div>
                        { tasks.length } Tasks
                    </div>
                    <div>
                        { doneTasksCount } completed ({(Math.round(doneTasksCount / tasksCount * 100))}%)
                    </div>
                </div>
            }
        </div>
    );
}

const sortList = [
    {
        name: 'Date',
        sortBy: 'DATE',
    },
    {
        name: 'Name',
        sortBy: 'NAME',
    },
];

export default ListOptions;
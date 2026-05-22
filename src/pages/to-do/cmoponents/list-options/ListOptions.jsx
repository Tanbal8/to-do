import { useContext } from "react";
import { FaFilter } from "react-icons/fa";
import { MdSort } from 'react-icons/md';
import GlobalContext from "../../../../contexts/GlobalContext";
import ToDoContext from "../../../../contexts/ToDoContext";
import './list-options.css';

const ListOptions = () => {
    const { notification } = useContext(GlobalContext);
    const { tasks, globalDispatch, activeListFilter, listFilters, taskListRef, listOptionsRef, themeMode } = useContext(ToDoContext);

    const doAllTheTasks = () => { // Do all the tasks
        if (tasks.every(task => task.done)) {
            new notification('message', 'All tasks are already done!');
            return;
        }
        globalDispatch({
            type: 'DO_ALL_THE_TASKS',
        });
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
            for (const task of filteredTasks) globalDispatch({
                type: 'DELETE_TASK',
                task,
            });
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

    const setActiveListFilter = newActiveListFilter => {
        globalDispatch({
            type: 'CHANGE_ACTIVE_LIST_FILTER',
            newActiveListFilter,
        });
    }

    const sortbuttonsClickHandler = (sortBy) => {
        globalDispatch({
            type: 'SORT_TASKS',
            sortBy,
        });
    }

    const tasksCount = tasks.length;
    const doneTasksCount = tasks.filter(task => task.done).length;

    return (
        <div id="list-options" ref={listOptionsRef}>
            <div id='list-filter-container' data-theme-mode={themeMode}>
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
            <div id="list-sort-container" data-theme-mode={themeMode}>
                <MdSort size={22} />
                <ul id="list-sort-list">
                {
                    sortList.map(sort => (
                        <li key={`sortBy-${sort.name}`}>
                            <button
                                onClick={() => sortbuttonsClickHandler(sort.sortBy)}
                            >{ sort.name }</button>
                        </li>
                    ))
                }
                </ul>
            </div>
            <div id="list-options-button-container" data-theme-mode={themeMode}>
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
                <div id="tasks-info" data-theme-mode={themeMode}>
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
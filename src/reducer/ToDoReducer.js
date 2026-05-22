import { compareDates } from '../utils/date';

const ToDoReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TASK': {
            const { newTask } = action;
            const createDate = getDate();            
            return {
                ...state,
                tasks: [
                    ...state.tasks,
                    {
                        id: (state.tasks.length ? Math.max(...state.tasks.map(task => task.id)) : 0) + 1,
                        task: newTask,
                        done: false,
                        createDate,
                        lastEditDate: null,
                    }
                ]
            };
        }
        case 'DELETE_TASK': {
            const { task } = action;
            const newTasks = state.tasks.filter(taskItem => taskItem.id !== task.id);
            return { 
                ...state,
                tasks: newTasks,
            };
        }
        case 'EDIT_TASK': {
            const { task, newTask } = action;
            const currentDate = getDate();
            currentDate.day = (Math.floor(Math.random() * 30) + 1).toString();
            const newTasks = state.tasks.map(taskItem => taskItem.id === task.id ?
                {
                    ...task,
                    task: newTask,
                    lastEditDate: currentDate,
                } : taskItem
            );
            return { 
                ...state,
                tasks: newTasks,
            };
        }
        case 'CHANGE_STATUS': {
            const { task } = action;
            const newStatus = !action.newStatus && action.newStatus !== false ? !task.done : action.newStatus;
            const newTasks = state.tasks.map(taskItem => taskItem.id === task.id ?
                {
                    ...task,
                    done: newStatus,
                } : taskItem
            );
            return { 
                ...state,
                tasks: newTasks
            };
        }
        case 'DO_ALL_THE_TASKS':
            return {
                ...state,
                tasks: state.tasks.map(task => {
                    return {
                        ...task,
                        done: true,
                    }
                    
                })
            }
        case 'CHANGE_ACTIVE_LIST_FILTER': {
            const { newActiveListFilter } = action;
            return {
                ...state,
                activeListFilter: newActiveListFilter,
            };
        }
        case 'CHANGE_TASK_ORDER': {
            const { from, to } = action;
            const newTasks = [...state.tasks];
            const [fromTask] = newTasks.splice(from, 1);
            newTasks.splice(to, 0, fromTask);
            return {
                ...state,
                tasks: newTasks,
            };
        }
        case 'SORT_TASKS': {
            const { sortBy } = action;
            let newTasks = [...state.tasks];
            switch (sortBy) {
                case 'DATE': {
                    newTasks.sort((task1, task2) => compareDates(task2.lastEditDate || task2.createDate, task1.lastEditDate || task1.createDate));
                    break;
                }
                case 'NAME': {
                    newTasks.sort((task1, task2) => task2.task.localeCompare(task1.task));
                    break;
                }
                default:
                    break;
            }
            if (state.tasks.every((task, index) => task.id === newTasks[index].id)) // 
                newTasks = newTasks.reverse();
            return {
                ...state,
                tasks: newTasks,
            };
        }
        case 'CHANGE_THEME_MODE':
            const { newThemeMode } = action;
            return {
                ...state,
                themeMode: newThemeMode,
            }
        default:
            return { ...state };
        }
}

const getDate = () => {
    const [month, day, year] = new Date().toLocaleDateString('en-US').split('/');
    return {
        year,
        month,
        day,
    };
}
    
export default ToDoReducer;
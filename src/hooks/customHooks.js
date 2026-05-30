import { useEffect, useState } from "react";
import { getDate, compareDates } from "../utils/date";

const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        const saved = localStorage.getItem(key);
        if (saved === null) return initialValue;
        try {
            return JSON.parse(saved);
        }
        catch {
            return saved;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}

const useTasksManager = (key, initialValue = []) => {
    // Data
    const [data, setData] = useLocalStorage(key, initialValue);

    // Operations
    const add = (newValues) => {
        setData(prev => {
            const newId = (prev.length > 0 ? Math.max(...prev.map(prevItem => prevItem.id)) :  0) + 1;
            return [
                ...prev,
                {
                    id: newId,
                    createDate: getDate(),
                    ...newValues,
                }
            ];
        });
    }

    const remove = (id) => {
        setData(prev =>
            prev.filter(prevItem =>
                prevItem.id !== id
            )
        );
    }

    const edit = (id, newValues) => {
        setData(prev =>
            prev.map(prevItem =>
                prevItem.id === id ?
                    {
                        ...prevItem,
                        ...newValues,
                        lastEditDate: getDate(),
                    }
                    : prevItem
            )
        );
    }

    const changeStatus = (id, newStatus = null) => {
        setData(prev =>
            prev.map(prevItem => {
                return prevItem.id === id ?
                {
                    ...prevItem,
                    done: newStatus === null ? !prevItem.done : newStatus,
                }
                : prevItem
            }
            )
        );
    }

    const doAll = () => {
        setData(prev =>
            prev.map(prevItem => {
                return {
                    ...prevItem,
                    done: true,
                }
            })
        );
    }

    const deleteAll = () => {
        setData(() => initialValue);
    }

    const changeOrder = (from, to) => {
        setData(prev => {
            const newData = [...prev];
            const [fromData] = newData.splice(from, 1);
            newData.splice(to, 0, fromData);
            return newData;
        });
    }

    const sort = (sortBy) => {
        setData(prev => {
            let newData = [...prev];
            switch (sortBy) {
                case 'DATE':
                    newData.sort((item1, item2) => compareDates(item2.lastEditDate || item2.createDate, item1.lastEditDate || item1.createDate));
                    break;
                case 'NAME':
                    newData.sort((item1, item2) => item2.task.localeCompare(item1.task));
                    break;
                default:
                    break;
            }
            if (newData.every((item, index) => item.id === prev[index].id)) newData.reverse();
            return newData;
        });
    } 

    return [data, {
        add,
        remove,
        edit,
        changeStatus,
        doAll,
        deleteAll,
        changeOrder,
        sort,
    }];
}

export {
    useLocalStorage,
    useTasksManager,
};
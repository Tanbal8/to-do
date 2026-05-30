import './task-item-option.scss';

const TaskItemIcon = ({ children, id, onClick = () => {} }) => (
    <button id={`task-item-option-${id}`} onClick={onClick}>
        { children }
    </button>
);

export default TaskItemIcon;
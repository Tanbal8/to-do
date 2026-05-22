import React from "react";
import './task-item-option.css';

const TaskItemIcon = ({ children, id, onClick = () => {} }) => (
    <button id={`task-item-option-${id}`} onClick={onClick}>
        { children }
    </button>
);

export default TaskItemIcon;
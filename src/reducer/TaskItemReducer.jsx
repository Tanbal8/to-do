const TaskItemReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_IS_EDITING':
            return {
                ...state,
                isEditing: !state.isEditing,
            }
        case 'DELETE':
            return {
                ...state,
                isDeleting: true,
            }
        default:
            return {...state};
    }
}

export default TaskItemReducer;
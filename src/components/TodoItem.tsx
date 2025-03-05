/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';

interface PropsTodoItem {
  filteredTodos: Todo[];
  isLoading: boolean;
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
  loadingTodos: number[];
}

export const TodoItem: React.FC<PropsTodoItem> = ({
  handleToggle,
  filteredTodos,
  handleDelete,
  loadingTodos,
}) => {
  return (
    <>
      {filteredTodos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={`todo ${todo.completed ? 'completed' : ''}`}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${loadingTodos.includes(todo.id) ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  onDelete,
  isLoading,
}) => {
  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`} data-cy="Todo">
      {}
      <label htmlFor={`todo-toggle-${todo.id}`} className="todo_status-label">
        <input
          type="checkbox"
          id={`todo-toggle-${todo.id}`}
          className="todo_status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
        disabled={isLoading}
      >
        ×
      </button>

      {isLoading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

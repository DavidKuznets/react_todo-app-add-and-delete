import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  setFilter: React.Dispatch<
    React.SetStateAction<'all' | 'active' | 'completed'>
  >;
  filter: 'all' | 'active' | 'completed';
  handleClearCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  todos,
  setFilter,
  filter,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      {}
      <span>{todos.length} items left</span>

      <button onClick={handleClearCompleted}>Clear completed</button>

      {}
      <button
        onClick={() => setFilter('all')}
        className={filter === 'all' ? 'selected' : ''}
      >
        All
      </button>
      <button
        onClick={() => setFilter('active')}
        className={filter === 'active' ? 'selected' : ''}
      >
        Active
      </button>
      <button
        onClick={() => setFilter('completed')}
        className={filter === 'completed' ? 'selected' : ''}
      >
        Completed
      </button>
    </footer>
  );
};

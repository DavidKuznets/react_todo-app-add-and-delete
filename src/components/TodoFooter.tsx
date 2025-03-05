/* eslint-disable @typescript-eslint/indent */
import { Todo } from '../types/Todo';

interface PropsFooter {
  setFilter: React.Dispatch<
    React.SetStateAction<'completed' | 'all' | 'active'>
  >;
  filter: 'completed' | 'all' | 'active';
  todos: Todo[];
  handleClearCompleted: () => void;
}

export const TodoFooter: React.FC<PropsFooter> = ({
  setFilter,
  filter,
  todos,
  handleClearCompleted,
}) => {
  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todos.filter(todo => !todo.completed).length} items left
          </span>
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
              data-cy="FilterLinkAll"
              onClick={() => setFilter('all')}
            >
              All
            </a>
            <a
              href="#/active"
              className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
              data-cy="FilterLinkActive"
              onClick={() => setFilter('active')}
            >
              Active
            </a>
            <a
              href="#/completed"
              className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilter('completed')}
            >
              Completed
            </a>
          </nav>
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={!todos.some(todo => todo.completed)}
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};

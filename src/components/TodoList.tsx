/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
  isLoading: boolean;
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
  loadingTodos: number[];
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  isLoading,
  handleToggle,
  handleDelete,
  loadingTodos,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
      style={{
        display: filteredTodos.length === 0 && !isLoading ? 'none' : 'block',
      }}
    >
      <TodoItem
        isLoading={isLoading}
        handleToggle={handleToggle}
        filteredTodos={filteredTodos}
        handleDelete={handleDelete}
        loadingTodos={loadingTodos}
      />
    </section>
  );
};

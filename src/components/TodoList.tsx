/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
  isLoading: boolean;
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
  loadingTodos: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  isLoading,
  handleToggle,
  handleDelete,
  loadingTodos,
  tempTodo,
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
        tempTodo={tempTodo}
      />
    </section>
  );
};

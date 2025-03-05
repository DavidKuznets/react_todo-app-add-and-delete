import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import '../styles/todo.scss';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
  loadingTodos: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  handleToggle,
  handleDelete,
  loadingTodos,
}) => {
  if (todos.length === 0) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}
    </section>
  );
};

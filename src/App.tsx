/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';

export interface Todo {
  id: number;
  userId?: number;
  title: string;
  completed: boolean;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodo.trim()) {
      setError('Title should not be empty');

      return;
    }

    const temp: Todo = {
      id: 0,
      title: newTodo.trim(),
      completed: false,
    };

    setTempTodo(temp);
    setIsLoading(true);

    try {
      const savedTodo = await addTodo({
        title: temp.title,
        completed: false,
      });

      setTodos(prev => [...prev, savedTodo]);
      setNewTodo('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setTimeout(() => inputRef.current?.focus(), 0);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingTodos(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      inputRef.current?.focus();
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleToggle = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => handleDelete(todo.id)));
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 140);
  }, []);

  useEffect(() => {
    const loadTodos = async () => {
      setError('');
      setIsLoading(true);
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setError('Unable to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.length > 0 && todos.every(todo => todo.completed) ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />
          <form onSubmit={handleAdd}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={event => setNewTodo(event.target.value)}
              disabled={isLoading}
              ref={inputRef}
            />
          </form>
        </header>

        <section
          className="todoapp__main"
          data-cy="TodoList"
          style={{
            display:
              filteredTodos.length === 0 && !isLoading ? 'none' : 'block',
          }}
        >
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

          {tempTodo && (
            <div
              key={tempTodo.id}
              data-cy="Todo"
              className={`todo ${tempTodo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                  onChange={() => handleToggle(tempTodo.id)}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDelete(tempTodo.id)}
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

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
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};

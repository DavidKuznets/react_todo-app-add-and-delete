import React, { useEffect, useState, useRef } from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodo.trim()) {
      setError('Title should not be empty');

      return;
    }

    const temp: Todo = { id: 0, title: newTodo.trim(), completed: false };

    setTempTodo(temp);
    setIsLoading(true);

    try {
      const savedTodo = await addTodo({ title: temp.title, completed: false });

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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          handleAdd={handleAdd}
          isLoading={isLoading}
          inputRef={inputRef}
        />
        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          loadingTodos={loadingTodos}
        />
        <TodoFooter
          todos={todos}
          setFilter={setFilter}
          filter={filter}
          handleClearCompleted={() =>
            setTodos(todos.filter(todo => !todo.completed))
          }
        />
      </div>
      {error && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError('')}
          />
          {error}
        </div>
      )}
    </div>
  );
};

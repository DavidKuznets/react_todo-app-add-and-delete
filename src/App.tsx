/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useState, useRef } from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { Todo } from './types/Todo';
import './styles/index.scss';
import './styles/todoapp.scss';
import './styles/filter.scss';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

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
      inputRef.current?.focus();
      setError('Todo cannot be empty');

      return;
    }

    setIsLoading(true);
    try {
      const newTodoItem = { title: newTodo, completed: false };
      const savedTodo = await addTodo(newTodoItem);

      setTodos([...todos, savedTodo]);
      setNewTodo('');
    } catch {
      inputRef.current?.focus();
      setError('Unable to add todo');
    } finally {
      inputRef.current?.focus();
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingTodos(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      inputRef.current?.focus();
      setError('Unable to delete todo');
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

  const handleClearCompleted = () => {
    const incompleteTodos = todos.filter(todo => !todo.completed);

    setTodos(incompleteTodos);
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  useEffect(() => {
    const loadTodos = async () => {
      setError('');
      setIsLoading(true);
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        inputRef.current?.focus();
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
        <TodoHeader
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          handleAdd={handleAdd}
          isLoading={isLoading}
          inputRef={inputRef}
          todos={todos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          isLoading={isLoading}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          loadingTodos={loadingTodos}
        />

        <TodoFooter
          setFilter={setFilter}
          filter={filter}
          handleClearCompleted={handleClearCompleted}
          todos={todos}
        />
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

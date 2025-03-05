interface Props {
  newTodo: string;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (event: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoHeader: React.FC<Props> = ({
  newTodo,
  setNewTodo,
  handleAdd,
  isLoading,
  inputRef,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodo.trim()) {
      return;
    }

    handleAdd(event);
    setNewTodo('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

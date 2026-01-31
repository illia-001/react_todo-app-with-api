import cn from 'classnames';
import React, { useEffect, useRef } from 'react';

type Props = {
  onSubmit: (value: React.FormEvent) => void;
  onSetTitle: (query: string) => void;
  onToggleAll: () => void;
  activeTodos: number;
  todosQuantity: number;
  isDisabled: boolean;
  query: string;
  focus: number;
};

export const NewTodo: React.FC<Props> = ({
  onSubmit,
  activeTodos,
  todosQuantity,
  onSetTitle,
  isDisabled,
  query,
  focus,
  onToggleAll,
}) => {
  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      inputFocus.current?.focus();
    }
  }, [isDisabled, focus]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todosQuantity > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: activeTodos === 0 })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => {
            onSetTitle(event.target.value);
          }}
          disabled={isDisabled}
          ref={inputFocus}
        />
      </form>
    </header>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  isProcessed?: boolean | undefined;
  isDoubleClick?: boolean;
  onDelete?: (todoId: number) => void;
  onUpdate?: (todo: Todo) => void;
  onDoubleClick?: (id: number) => void;
  onEdit?: (query: string, todo: Todo) => void;
  selectedTodoId?: number | null;
  focusEdit?: number;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete = () => {},
  onUpdate = () => {},
  onEdit = () => {},
  isProcessed = false,
  isDoubleClick,
  onDoubleClick = () => {},
  selectedTodoId,
  focusEdit,
}) => {
  const { id, title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const isClicked = selectedTodoId === id && isDoubleClick;
  const focusInputEdit = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNewTitle(title);
        onDoubleClick(id);
      }

      return;
    };

    if (isClicked) {
      document.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedTodoId]);

  useEffect(() => {
    if (focusInputEdit.current && isDoubleClick) {
      focusInputEdit.current.focus();
    }
  }, [focusEdit]);

  const handleSubmitNewTitle = (event: React.FormEvent) => {
    event.preventDefault();

    onEdit(newTitle, todo);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onUpdate(todo)}
          checked={completed}
        />
      </label>

      {(isClicked && (
        <form onSubmit={handleSubmitNewTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={event => {
              setNewTitle(event.target.value);
            }}
            onBlur={handleSubmitNewTitle}
            value={newTitle}
            ref={focusInputEdit}
            autoFocus
          />
        </form>
      )) || (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              onDoubleClick(id);
            }}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

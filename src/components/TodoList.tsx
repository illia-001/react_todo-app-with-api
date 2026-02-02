import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  visibleTodos: Todo[];
  onDelete: (todoId: number) => void;
  onDoubleClick: (id: number) => void;
  toggleTodoStatus: (todo: Todo) => void;
  creating: Todo | null;
  isLoading: number[];
  isDoubleClick: boolean;
  onEditTitle: (query: string, todo: Todo) => void;
  selectedTodoId: number | null;
  focusEdit: number;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  toggleTodoStatus,
  creating,
  isLoading,
  onEditTitle,
  isDoubleClick,
  onDoubleClick,
  selectedTodoId,
  focusEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
            appear={true}
          >
            <TodoItem
              isDoubleClick={isDoubleClick}
              todo={todo}
              isProcessed={isLoading.includes(todo.id)}
              onDelete={onDelete}
              onUpdate={toggleTodoStatus}
              onEdit={onEditTitle}
              onDoubleClick={onDoubleClick}
              selectedTodoId={selectedTodoId}
              focusEdit={focusEdit}
            />
          </CSSTransition>
        ))}

        {creating && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
            appear={true}
          >
            <TodoItem todo={creating} isProcessed={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

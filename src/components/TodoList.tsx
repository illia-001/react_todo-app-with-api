import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  visibleTodos: Todo[];
  onDelete: (todoId: number) => void;
  toggleTodoStatus: (todo: Todo) => void;
  creating: Todo | null;
  processingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  toggleTodoStatus,
  creating,
  processingIds,
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
              todo={todo}
              isProcessed={processingIds.includes(todo.id)}
              onDelete={() => onDelete(todo.id)}
              onUpdate={todoForEditing => {
                toggleTodoStatus(todoForEditing);
              }}
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

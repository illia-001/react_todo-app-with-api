/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
//#region import
import classNames from 'classnames';

import React, { useEffect, useState } from 'react';

import * as todoServise from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

import { Todo } from './types/Todo';
import { Filters } from './types/Filters';

import { Header } from './components/Header';
import { Errors } from './types/Errors';
import { normalizeTitle } from './utils/normilizeTitle';
import { filteringTodos } from './utils/filteringTodos';
//#endregion

export const App: React.FC = () => {
  //#region state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [filterByField, setFilterByField] = useState<Filters>(Filters.Default);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [completedTodoIds, setCompletedTodoIds] = useState<number[]>([]);
  const [isInputDisable, setIsInputDisable] = useState<boolean>(false);
  const [focus, setFocus] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<number[]>([]);

  const [title, setTitle] = useState('');

  const activeTodosCount: number = todos.filter(todo => !todo.completed).length;
  const todosCount = todos.length;
  //#endregion

  useEffect(() => {
    const calculateCompletedTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setCompletedTodoIds(calculateCompletedTodos);
  }, [todos]);

  const handleShowError = (error: Errors) => {
    setErrorMessage(error);
  };

  useEffect(() => {
    todoServise
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleShowError(Errors.LoadTodos);
      });
  }, []);

  useEffect(() => {
    if (errorMessage === Errors.Default) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(Errors.Default);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  //#region handlers
  const handleChangeFilterField = (filterField: Filters) => {
    setFilterByField(filterField);
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(prev => [...prev, todoId]);
    todoServise
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setFocus(current => current + 1);
      })
      .catch(() => handleShowError(Errors.DeleteTodo))
      .finally(() => {
        setIsLoading(prev => prev.filter(prevId => prevId !== todoId));
      });
  };

  const handleClearComplatedTodos = () => {
    completedTodoIds.forEach(todoId => {
      handleDeleteTodo(todoId);
    });
  };

  const handleSubmitNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = normalizeTitle(title);

    if (!normalizedTitle) {
      handleShowError(Errors.EmptyTitle);

      return;
    }

    setIsInputDisable(true);

    setErrorMessage(Errors.Default);

    const newTempTodo = {
      id: 0,
      userId: 3884,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setIsLoading(prev => [...prev, newTempTodo.id]);

    todoServise
      .createTodo(newTempTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => handleShowError(Errors.AddTodo))
      .finally(() => {
        setTempTodo(null);
        setIsInputDisable(false);
        setIsLoading(prev => prev.filter(prevId => prevId !== newTempTodo.id));
      });
  };

  const handleChangeTodoStatus = (todo: Todo) => {
    const { id, completed } = todo;

    setIsLoading(prev => [...prev, id]);

    if (!completedTodoIds.includes(id)) {
      setCompletedTodoIds(prev => [...prev, id]);
    } else {
      setCompletedTodoIds(prev => prev.filter(todoId => todoId !== id));
    }

    todoServise
      .editTodo(id, { completed: !completed })
      .then(editedTodo => {
        setTodos(prev =>
          prev.map(oldTodo => {
            if (oldTodo.id === id) {
              return editedTodo;
            }

            return oldTodo;
          }),
        );
      })
      .catch(() => handleShowError(Errors.UpdateTodo))
      .finally(() => {
        setIsLoading(prev => prev.filter(prevId => prevId !== id));
      });
  };

  const handleToggleAllTodos = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    if (activeTodos.length === 0) {
      todos.forEach(todo => handleChangeTodoStatus(todo));
    } else {
      activeTodos.forEach(currentTodo => {
        setIsLoading(prev => [...prev, currentTodo.id]);
        todoServise
          .editTodo(currentTodo.id, { completed: true })
          .then(editedTodo => {
            setTodos(prev =>
              prev.map(todo => (todo.id === editedTodo.id ? editedTodo : todo)),
            );
          })
          .catch(() => handleShowError(Errors.UpdateTodo))
          .finally(() => {
            setIsLoading(prev =>
              prev.filter(prevId => prevId !== currentTodo.id),
            );
          });
      });
    }
  };

  //#endregion

  const filteredTodos = filteringTodos(todos, filterByField);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={handleSubmitNewTodo}
          query={title}
          onSetTitle={setTitle}
          activeTodos={activeTodosCount}
          todosQuantity={todosCount}
          isDisabled={isInputDisable}
          focus={focus}
          onToggleAll={handleToggleAllTodos}
        />

        {todos.length > 0 && (
          <TodoList
            isLoading={isLoading}
            visibleTodos={filteredTodos}
            creating={tempTodo}
            onDelete={handleDeleteTodo}
            toggleTodoStatus={handleChangeTodoStatus}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {(todos.length > 0 || tempTodo) && (
          <Footer
            onChangeFilter={handleChangeFilterField}
            onClear={handleClearComplatedTodos}
            filterField={filterByField}
            completedItemsCount={todos.length - activeTodosCount}
            activeItemsCount={activeTodosCount}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorMessage === Errors.Default },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage(Errors.Default);
          }}
        />
        {errorMessage}
        <br />
      </div>
    </div>
  );
};

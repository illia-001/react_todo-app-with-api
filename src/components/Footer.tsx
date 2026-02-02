import cn from 'classnames';

import React from 'react';
import { Filters } from '../types/Filters';

type FooterProps = {
  filterField: Filters;
  completedItemsCount: number;
  activeItemsCount: number;
  onChangeFilter: (filterBy: Filters) => void;
  onClear: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  filterField,
  completedItemsCount,
  activeItemsCount,
  onChangeFilter,
  onClear,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeItemsCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterField === Filters.Default,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onChangeFilter(Filters.Default)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterField === Filters.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onChangeFilter(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterField === Filters.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onChangeFilter(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClear}
        disabled={completedItemsCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};

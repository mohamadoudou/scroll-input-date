import React, { useState, useRef, useEffect, MouseEvent, memo } from 'react';
import Tooltip from '../Tooltip';
import { MONTHS, DATE_SCROLL_LIST_TYPE } from '../../constants';
import { createArrayDateData, getDayMonthYear, getYearsData } from '../../utils/date-time';
import { Placement } from '@floating-ui/react';
import CloseIcon from '../CloseIcon';
import { ListType } from '../../types';
import ItemList from './ItemList';
import styles from './scrollDatePicker.module.scss';

export type HandleClickParams = {
  e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>;
  ulElement: HTMLUListElement | null;
  listType: ListType;
  elementIndex: number;
};

export type HandleScrollParams = {
  dateStr: string;
  ulElement: HTMLUListElement;
  listType: ListType;
  dataLength: number;
};

type Props = Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> & {
  value: string;
  onChange: (value: string) => void;
  showYear: boolean;
  listHeight?: number;
  numberOfElementInView?: number;
  modalWidth?: number;
  daysData?: string[];
  monthsData?: string[];
  yearsData?: string[];
  placement?: Placement;
  showClearDate?: boolean;
};

function InputDatePicker({
  id,
  name,
  value,
  className,
  placeholder,
  onChange,
  onBlur,
  showYear,
  listHeight = 196,
  // Need to be an odd number to work correctly
  numberOfElementInView = 7,
  modalWidth = 180,
  daysData = createArrayDateData({ start: 1, end: 31 }),
  monthsData = MONTHS,
  yearsData = getYearsData(),
  placement = 'bottom',
  showClearDate = false,
}: Props) {
  const [controlledVisible, setControlledVisible] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [previousElementInViewPort, setPreviousElementInViewPort] = useState<number | null>(null);

  const ulMonthRef = useRef<HTMLUListElement>(null);
  const ulDayRef = useRef<HTMLUListElement>(null);
  const ulYearRef = useRef<HTMLUListElement>(null);

  const listItemHeight = listHeight / numberOfElementInView;

  const handleScrollTo = (ulElement: HTMLUListElement | null, index: number) => {
    if (!ulElement) {
      return;
    }

    ulElement.scrollTo({
      top: index * listItemHeight,
    });
  };

  useEffect(() => {
    // Scroll to the target date element when we open the date popup
    if (controlledVisible) {
      const { day, month, year } = getDayMonthYear(value);
      handleScrollTo(ulMonthRef.current, month - 1);
      handleScrollTo(ulDayRef.current, day - 1);
      if (showYear) {
        handleScrollTo(ulYearRef.current, year - parseInt(yearsData[0], 10));
      }
    }

    return () => {
      // Reset first open
      setIsFirstOpen(true);
    };
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [controlledVisible, showYear]);

  const getNewDateStr = (
    listType: ListType,
    elementIndexPosition: number,
    dateStr: string = ''
  ) => {
    let { day, month, year } = getDayMonthYear(dateStr);

    if (listType === DATE_SCROLL_LIST_TYPE.month) {
      month = elementIndexPosition + 1;
    }

    if (listType === DATE_SCROLL_LIST_TYPE.day) {
      day = elementIndexPosition + 1;
    }

    if (listType === DATE_SCROLL_LIST_TYPE.year) {
      year = elementIndexPosition + parseInt(yearsData[0], 10);
    }

    const newDateString = `${day.toString().padStart(2, '0')}/${month
      .toString()
      .padStart(2, '0')}${showYear ? `/${year.toString().padStart(4, '0')}` : ''}`;

    return newDateString;
  };

  const handleScroll = ({ dateStr, ulElement, listType, dataLength }: HandleScrollParams) => {
    const elementIndexPosition = Math.round(ulElement.scrollTop / listItemHeight);

    if (
      previousElementInViewPort !== elementIndexPosition &&
      (!isFirstOpen || dateStr) &&
      // the dataLength of the date is check to avoid updating when user over scroll the item, for example ios devices.
      elementIndexPosition < dataLength &&
      elementIndexPosition >= 0
    ) {
      const newDateString = getNewDateStr(listType, elementIndexPosition, dateStr);
      onChange(newDateString);
    }

    setIsFirstOpen(false);
    setPreviousElementInViewPort(elementIndexPosition);
  };

  const handleClick = ({ e, ulElement, listType, elementIndex }: HandleClickParams) => {
    e.preventDefault();

    if (!ulElement) {
      return;
    }

    // When the clicked element is in the center of the view, we just set it value
    // because we can not scroll to an element that's is already in the center of the view.
    if (Math.round(ulElement.scrollTop / listItemHeight) === elementIndex) {
      const newDateString = getNewDateStr(listType, elementIndex, value);
      onChange(newDateString);
    } else {
      handleScrollTo(ulElement, elementIndex);
    }
  };

  return (
    <div className={styles.scrollDatePicker} id="scroll-date-picker">
      <Tooltip
        placement={placement}
        isOpen={controlledVisible}
        setIsOpen={setControlledVisible}
        triggerElement={
          <>
            <input
              id={id}
              name={name}
              type="text"
              value={value}
              className={className}
              placeholder={placeholder}
              onChange={(e) => {
                const newValue = e.target?.value.replace(/[^0-9/]/g, ''); // Allow only numeric and slash characters
                onChange(newValue);
              }}
              onBlur={onBlur}
            />
            {showClearDate && value ? (
              <button
                className="um-clear-date-btn"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onChange('');
                }}
              >
                <CloseIcon />
              </button>
            ) : null}
          </>
        }
      >
        <div className={styles.popup} style={{ minWidth: modalWidth }}>
          <div className={styles.viewportMask} style={{ height: listItemHeight }}></div>
          <ItemList
            dateStr={value}
            listData={daysData}
            ulElementRef={ulDayRef}
            listStyle={styles.dayList}
            listType={DATE_SCROLL_LIST_TYPE.day}
            listHeight={listHeight}
            numberOfElementInView={numberOfElementInView}
            handleScroll={handleScroll}
            handleClick={handleClick}
          />
          <ItemList
            dateStr={value}
            listData={monthsData}
            ulElementRef={ulMonthRef}
            listStyle={styles.monthList}
            listType={DATE_SCROLL_LIST_TYPE.month}
            listHeight={listHeight}
            numberOfElementInView={numberOfElementInView}
            handleScroll={handleScroll}
            handleClick={handleClick}
          />
          {showYear ? (
            <ItemList
              dateStr={value}
              listData={yearsData}
              ulElementRef={ulYearRef}
              listStyle={styles.yearList}
              listType={DATE_SCROLL_LIST_TYPE.year}
              listHeight={listHeight}
              numberOfElementInView={numberOfElementInView}
              handleScroll={handleScroll}
              handleClick={handleClick}
            />
          ) : null}
        </div>
      </Tooltip>
    </div>
  );
}

export default memo(InputDatePicker);

import React from 'react';
import { ListType } from '../../types';
import styles from './scrollDatePicker.module.scss';
import { HandleClickParams } from '.';

type Props = {
  text: string;
  ulElement: HTMLUListElement | null;
  listType: ListType;
  index: number;
  dataLength: number;
  numberOfElementInView: number;
  listItemHeight: number;
  handleClick: (params: HandleClickParams) => void;
};

const Item = ({
  text,
  ulElement,
  listType,
  index,
  dataLength,
  numberOfElementInView,
  listItemHeight,
  handleClick,
}: Props) => {
  const marginTopBottomValue = (Math.round(numberOfElementInView / 2) - 1) * listItemHeight;
  const firstElementMarginTop = index === 0 ? marginTopBottomValue : '';
  const lastElementMarginBottom = index === dataLength - 1 ? marginTopBottomValue : '';

  return (
    <li
      key={`${index}-${text}`}
      className={styles.listItem}
      style={{
        height: listItemHeight,
        marginTop: firstElementMarginTop,
        marginBottom: lastElementMarginBottom,
      }}
    >
      <button
        className={styles.listItemBtn}
        type="button"
        // Avoid focusing when tab key is pressed
        tabIndex={-1}
        onClick={(e) => {
          handleClick({ e, ulElement, listType, elementIndex: index });
        }}
      >
        {text}
      </button>
    </li>
  );
};

export default Item;

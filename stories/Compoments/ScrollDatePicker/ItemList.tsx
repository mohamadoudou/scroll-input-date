import React, { RefObject } from 'react';
import classNames from 'classnames';
import { ListType } from '../../types';
import Item from './Item';
import { HandleClickParams, HandleScrollParams } from '.';
import styles from './scrollDatePicker.module.scss';

export type Props = {
  dateStr: string;
  listData: string[];
  ulElementRef: RefObject<HTMLUListElement>;
  listStyle: string;
  listType: ListType;
  listHeight: number;
  numberOfElementInView: number;
  handleScroll: (params: HandleScrollParams) => void;
  handleClick: (params: HandleClickParams) => void;
};

const ItemList = ({
  dateStr,
  listData,
  ulElementRef,
  listStyle,
  listType,
  listHeight,
  numberOfElementInView,
  handleScroll,
  handleClick,
}: Props) => (
  <section className={classNames(styles.popupSection, listStyle)}>
    <ul
      className={styles.popupList}
      style={{ height: listHeight }}
      ref={ulElementRef}
      onScroll={() => {
        if (ulElementRef.current) {
          handleScroll({
            dateStr,
            ulElement: ulElementRef.current,
            listType,
            dataLength: listData.length,
          });
        }
      }}
    >
      {listData.map((text, index) => (
        <Item
          key={`${index}-${text}`}
          text={text}
          ulElement={ulElementRef.current}
          listType={listType}
          index={index}
          dataLength={listData.length}
          numberOfElementInView={numberOfElementInView}
          listItemHeight={listHeight / numberOfElementInView}
          handleClick={handleClick}
        />
      ))}
    </ul>
  </section>
);

export default ItemList;

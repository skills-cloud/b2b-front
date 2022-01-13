import React, { useState, useMemo, useEffect, Fragment, ReactNode } from 'react';
import { Table as AntTable, TableProps } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { v4 as uuid } from 'uuid';

import useClassnames from 'hook/use-classnames';

import IconSortable from 'component/icons/sortable';
import IconSortedAsc from 'component/icons/sorted-asc';
import IconSortedDesc from 'component/icons/sorted-desc';
import IconArrowLeft from 'component/icons/left-arrow';
import IconArrowRight from 'component/icons/right-arrow';

export const SCROLL_OFFSET = 20;

import 'antd/lib/table/style/index.css';

import style from './index.module.pcss';

export interface IProps<T> extends TableProps<T> {
    className?: string,
    isSelectable?: boolean,
    onScroll?(isScrolled: boolean): void,
    onBottomScroll?(): void
}

export const defaultPaginationOptions = {
    showSizeChanger: false,
    itemRender     : (page: number, itemName: string, component: ReactNode) => {
        if(itemName === 'prev') {
            return <IconArrowLeft />;
        }

        if(itemName === 'next') {
            return <IconArrowRight />;
        }

        return component;
    }
};

// eslint-disable-next-line @typescript-eslint/ban-types
const Table = <T extends object>({ columns, rowKey, dataSource, pagination, loading, onChange, className, ...props }: IProps<T>) => {
    const cn = useClassnames(style, className, true);
    const [isScrolled, setIsScrolled] = useState(false);
    const id = useMemo(() => props.id || uuid(), [props.id]);

    const columnsWithCustomSort = useMemo(() => {
        const newColumns = (props.isSelectable && columns) ? [{ width: 4, shrinkable: true }, ...columns] : columns;

        return newColumns?.map((column: ColumnType<T>) => {
            if(column.sorter && typeof column.title !== 'function') {
                const title = column.title;

                column.title = (p) => {
                    const order = p.sortColumns?.find((c) => c.column.dataIndex === column.dataIndex)?.order;
                    const orderIcon = order === 'ascend' ? (
                        <IconSortedAsc svg={{ className: cn('table__sorter-icon') }} />
                    ) : (
                        <IconSortedDesc svg={{ className: cn('table__sorter-icon') }} />
                    );
                    const sortableIcon = <IconSortable svg={{ className: cn('table__sorter-icon') }} />;

                    return <Fragment>{title}{order ? orderIcon : sortableIcon}</Fragment>;
                };
                column.showSorterTooltip = false;
            }

            return column;
        });
    }, [columns]);

    useEffect(() => {
        const handleScroll = (event: Event) => {
            setIsScrolled((event.target as Element)?.scrollTop > 0);
        };

        const $body = document.querySelector(`[id="${id}"] .ant-table-body`);

        $body?.addEventListener('scroll', handleScroll);

        return () => $body?.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        props.onScroll?.(isScrolled);
    }, [isScrolled, props.onScroll]);

    useEffect(() => {
        const bottomRow = document.querySelector(`.ant-table-row.ant-table-row-level-0:nth-last-child(-n + ${SCROLL_OFFSET})`);
        const bottomObserver = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting) {
                props.onBottomScroll?.();
            }
        });

        if(bottomRow) {
            bottomObserver.observe(bottomRow);
        }

        return () => {
            if(bottomRow) {
                bottomObserver.unobserve(bottomRow);
            }
        };
    }, [dataSource?.length]);

    return (
        <AntTable
            locale={{ emptyText: ' ' }}
            columns={columnsWithCustomSort}
            rowKey={rowKey}
            dataSource={dataSource}
            pagination={pagination ? { ...defaultPaginationOptions, ...pagination } : false}
            loading={loading}
            onChange={onChange}
            className={cn('table', { 'table_scrolled': isScrolled, 'table_selectable': props.isSelectable })}
            id={id}
            {...props}
        />
    );
};

export default Table;

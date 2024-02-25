import React, { FC, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { IPaginatedTodos } from '@src/lib/interfaces/IPaginatedTodos';
import { ITodo } from '@src/lib/interfaces/ITodo';

const PaginatedTodoPage: FC = () => {
    const [page, setPage] = useState(0);

    const fetchTodos = (pageNumber = 0) => fetch(`/api/todo/${pageNumber}`).then((res) => res.json());

    const queryClient = useQueryClient();

    // is fetching dictates if currently fetching in the background
    // isPreviousData tells whether current data is previous ot current
    const { isLoading, data, isFetching, isPreviousData } = useQuery<IPaginatedTodos, Error>(
        ['todos', page],
        () => fetchTodos(page),
        { keepPreviousData: true }
    );

    // Prefetch the next 2 pages on every page load!
    useEffect(() => {
        if (data?.hasMore) {
            queryClient.prefetchQuery(['todos', page + 1], () => fetchTodos(page + 1))
            queryClient.prefetchQuery(['todos', page + 2], () => fetchTodos(page + 2))
        }
    }, [data, page, queryClient]);

    if (isLoading) {
        return <div>Loading ...</div>
    }

    return (
        <>
            {data?.todos.map((todo:ITodo) => (
                <p key={todo.id}> {todo.message} </p>
            ))}
            <span>Current Page: {page + 1}</span>
            <br />
            <button type="button" onClick={() => setPage((old) => Math.max(old - 1, 0))} disabled={page === 0}>
                Previous Page
            </button>
            <button type="button" onClick={() => {
                if (!isPreviousData && data?.hasMore) {
                    setPage((old) => old + 1);
                }
            }} >
                Next Page
            </button>
            {isFetching ? <span> Loading... </span> : null}{''}
        </>
    )


}

export default PaginatedTodoPage;
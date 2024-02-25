import { FC, useState } from 'react';
import Link from 'next/link';
import { useQueries, useQuery, useQueryClient, UseQueryResult } from 'react-query';
// import person from '@pages/api/person';
import { IPerson } from '@src/lib/interfaces/IPerson'
import PersonComponent from '@src/components/PersonComponent';
import { ITodo } from '@src/lib/interfaces/ITodo';

export const fetchPerson = async (): Promise<IPerson> => {
    const res = await fetch(`/api/person`);
    // const res = await fetch(`/api/person/123`);
    //need to do this with fetch since this doesn't automatically throw errors axios and graphql request do
    if (res.ok) {
        return res.json();
    }
    throw new Error('Network response not ok from Person')
}

const fetchTodo = async (): Promise<ITodo> => {
    const res = await fetch(`/api/todo`);

    if (res.ok) {
        return res.json();
    }
    throw new Error('Network response not ok from Todo');
};


const PersonPage: FC = () => {
    const [enabled, setEnabled] = useState(true);
    const userQueries = useQueries(
        ['1', '2', '3'].map((id) => {
            return {
                queryKey: ['todo', { page: id }],
                queryFn: () => {
                    return id;
                },
                enabled
            }
        })
    );
    const queryClient = useQueryClient();

    const { isLoading, isError, isSuccess: personSuccess, error, data }: UseQueryResult<IPerson, Error> = useQuery<
        IPerson, Error>(
            'person',
            fetchPerson,
            { enabled, }

        );

    const { isSuccess: todoSuccess }: UseQueryResult<ITodo, Error> = useQuery<ITodo, Error>(
        'todo',
        fetchTodo,
        {
            enabled
        });

    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }


    if (isError) return <p>Boom boy: Error is -- {error?.message}</p>;

    if (personSuccess && todoSuccess && enabled) {
        setEnabled(false);
    }

    return (
        <>
            <Link href="/">
                <a>Homes</a>
            </Link>
            <br />
            <button type="button" onClick={(event) => {
                event.preventDefault();
                queryClient.invalidateQueries();
            }}>
                Invalidate Queries
            </button>
            <br />
            <button type="button" onClick={(event) => {
                event.preventDefault();
                queryClient.invalidateQueries('person');
            }}>
                Invalidate Queries
            </button>
            <br />
            <button type="button" onClick={(event) => {
                event.preventDefault();
                queryClient.invalidateQueries({
                    predicate: (query:any) => {
                        return parseInt(query.queryKey[1].page) % 2 === 1
                    }
                })
            }}>
                Invalidate Todo
            </button>

            {/* <button type="button" onClick={(event) => {
                event.preventDefault();
                queryClient.invalidateQueries(['todo', '1'], { exact: true });
            }}>
                Invalidate Todo 1
            </button> */}

            <p>{data?.id}</p>
            <p>{data?.name}</p>
            <p>{data?.age}</p>
            <h1>Person Component</h1>
            {/* <PersonComponent /> */}
        </>
    );
};

export default PersonPage;
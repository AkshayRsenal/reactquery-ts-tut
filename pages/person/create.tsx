import React, { FC, FormEventHandler, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { QueryClient, UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from 'react-query';
import { IPerson } from '@src/lib/interfaces/IPerson';
import { fetchPerson } from '.';

const createPerson = async (id: string, name: string, age: number): Promise<IPerson> => {
    const res: Response = await fetch('/api/person/create', {
        method: 'POST',
        body: JSON.stringify({
            id,
            name,
            age,
        }),
    });

    if (res.ok) {
        return res.json();
    }
    throw new Error('Error create person');
}

interface ICreatePersonParams {
    id: string;
    name: string;
    age: number;
}


interface IContext {
    previousPerson: IPerson | undefined;
}

const CreatePage: FC = () => {
    const [enabled, setEnabled] = useState(false);
    // const enabled = true; 
    const { data: queryData }: UseQueryResult<IPerson, Error> = useQuery<IPerson, Error>('person', fetchPerson, {
        enabled,
    });
    const queryClient = useQueryClient();

    // const { isLoading: queryIsLoading, data: queryData }: UseQueryResult<IPerson, Error> = useQuery<IPerson, Error>(
    //     'person',
    //     fetchPerson
    // )

    const mutation: UseMutationResult<IPerson, Error, ICreatePersonParams> = useMutation<
        IPerson,
        Error,
        ICreatePersonParams,
        IContext | undefined
    >(async ({ id, name, age }) => createPerson(id, name, age), {

        // before mutation
        onMutate: async (_variables: ICreatePersonParams) => {

            // Cancel any outgoing References (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries('person');

            // Snapshot the previous Value
            const previousPerson: IPerson | undefined = queryClient.getQueryData('person');

            const newPerson: IPerson = {
                id: '123',
                age: 200,
                name: 'Lebron James',
            }

            // optimistically update
            queryClient.setQueryData('person', newPerson);


            return {previousPerson};


            // queryClient.invalidateQueries('person')
            console.log('mutation variables', _variables);
            // return { id: '7' };
        },
        // on success of mutation
        onSuccess: (data: IPerson, _variables: ICreatePersonParams, _context: IContext | undefined) => {

            queryClient.invalidateQueries('person');
            // queryClient.setQueryData('person', data);
            return console.log('muatation data', data);
        },
        // if muatation causes errors
        onError: (error: Error, _variables: ICreatePersonParams, context: IContext | undefined) => {
            console.log('error:', error.message);
            queryClient.setQueryData('person',context?.previousPerson)
            return console.log('Rolling back optimistic update with ID: ${context?.previousPerson?.id}');
        },
        // no matter if Error or suceess run below
        onSettled: (
            _data: IPerson | undefined,
            _error: Error | null,
            _variables: ICreatePersonParams | undefined,
            _context: IContext | undefined
        ) => {
            return console.log('complete mutation');
        },

    });

    const onSubmit: FormEventHandler<HTMLFormElement> = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            name: { value: string };
            age: { value: number };
        };

        const id = '1';
        const name = target.name.value;
        const age = target.age.value;
        mutation.mutate({ id, name, age });
    };

    return (
        <>
            {mutation.isLoading ? (
                <p>Adding todo</p>
            ) : (
                <>
                    {mutation.isError ? <div> An error occured: {mutation?.error?.message}</div> : null}
                    {mutation.isSuccess ? (
                        <div>
                            Person added! Person name is {mutation?.data?.name} and he is {mutation?.data?.age}
                        </div>
                    ) : null}{''}
                </>

            )}

            <button type="button"
                onClick={() => {
                    setEnabled(!enabled);
                    queryClient.invalidateQueries('person');
                }}
            >Invalidate Cache
            </button>

            <form onSubmit={onSubmit}>
                <label htmlFor="name">Name:</label>
                <br />
                <input type="text" id="name" name="name" />
                <br />
                <label htmlFor="age">age:</label>
                <br />
                <input type="text" id="age" name="age" />
                <br />
                <input type="submit" value="Submit" />
            </form>

            {queryData && (
                <>
                    <h1>Person is</h1>
                    <p>Name: {queryData?.name}</p>
                    <p>Age: {queryData?.age}</p>
                </>
            )}
        </>

    );
};

export default CreatePage;


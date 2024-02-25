import React, { FC } from 'react';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { Query, QueryKey, useQueries, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { IPerson } from '@src/lib/interfaces/IPerson'


const getPersonById = async (id: string | string[] | undefined): Promise<IPerson> => {
    if (typeof id === 'string') {
        const res = await fetch(`/api/person/${id}`);
        //need to do this with fetch since this doesn't automatically throw errors axios and graphql request do
        if (res.ok) {
            return res.json();
        }
        throw new Error('error fetching user with id');
    }
    throw new Error('invalid id');
};

// const fetchPerson = async (): Promise<IPerson> => {
//     const res = await fetch(`/api/person`);
//     //need to do this with fetch since this doesn't automatically throw errors axios and graphql request do
//     if (res.ok) {
//         return res.json();
//     }
//     throw new Error('Network response not ok')
// }


const PersonPage: FC = () => {
    //   const [enabled, setEnabled] = useState(true);
    const {
        query: { id },
    } = useRouter();
    const { isLoading, isError, error, data } = useQuery<
        IPerson, Error>(
            ['person', id],
            () => getPersonById(id),
            {
                enabled: !!id //enabled will stop a query from running, so will only call when id is available (dependent queries)
            }
        );

    //Cached key would be ['person']
    //const name = 'Tlw'

/*     const { isLoading, isError, error, data } = useQuery<IPerson, Error>(['person', id, name], () => getPersonById(id, name), {
        enabled: Boolean(id), // enabled 
    }
 */
    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isError) return <p>Boom boy: Error is -- {error?.message}</p>;


    //   const queryClient = useQueryClient();
    return (
        <>
            <p>{data?.id}</p>
            <p>{data?.name}</p>
            <p>{data?.age}</p>
            <h1></h1>
        </>
    );
};

export default PersonPage;
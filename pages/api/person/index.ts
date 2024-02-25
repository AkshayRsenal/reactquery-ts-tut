import { NextApiRequest, NextApiResponse } from 'next';
import { IPerson } from '@src/lib/interfaces/IPerson';

export default (_req: NextApiRequest, res: NextApiResponse<IPerson | Error>): void => {
    // const {
    //     query: { id },
    // } = _req;

    console.log(`getting person`);
    res.status(200).json({ id: '1', name: 'John Doe', age: 25 });
}

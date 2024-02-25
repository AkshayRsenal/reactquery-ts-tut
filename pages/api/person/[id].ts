import { NextApiRequest, NextApiResponse } from 'next';
import { IPerson } from '@src/lib/interfaces/IPerson';

export default (_req: NextApiRequest, res: NextApiResponse<IPerson | Error>): void => {
    const {
        query: { id },
    } = _req;

    if (typeof id === 'string') {
        console.log(`getting person by id: ${id}`);
        res.status(200).json({ id, name: 'Johnny Dope', age: 25 });
    } else {
        res.status(500).json(new Error('id is not of correct type'));
    }
}

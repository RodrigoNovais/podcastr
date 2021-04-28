import '../../../extensions/number-extensions';
import { NextApiRequest, NextApiResponse } from 'next';

import database from '../../../database/config';

export type Pagination = {
    page: number;
    limit: number;
}

export default async(req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const id = String(req.query.id);

    const episodes = database.get('episodes');

    const response = episodes
        .find({ id: id })
        .value();

    res.status(200);
    res.json(response);
};

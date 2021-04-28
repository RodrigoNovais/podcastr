import '../../extensions/number-extensions';
import { NextApiRequest, NextApiResponse } from 'next';

import database from '../../database/config';

export type Pagination = {
    page: number;
    limit: number;
}

const pagination = (_page: string | string[], _limit: string | string[]): Pagination => {
    const page = typeof _page === 'string' ? Math.max(Number.tryParseInt(_page, 0), 1) : 1;
    const limit = typeof _limit === 'string' ? Math.max(Number.tryParseInt(_limit, 10), 1) : 10;

    return { page, limit };
};

export default async(req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const { page, limit } = pagination(req.query.page, req.query.limit);

    const episodes = database.get('episodes');

    const response = episodes
        .slice((page - 1) * limit, page * limit)
        .value();

    res.status(200);
    res.json(response);
};

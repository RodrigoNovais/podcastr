import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

export type Episode = {
    id: string;
    title: string;
    members: string;
    published_at: string,
    thumbnail: string;
    description: string;
    file: {
        url: string;
        type: string;
        duration: number;
    };
}

const adapter = new FileSync<{ episodes: Episode[] }>('./database/server.json');
const database = low(adapter);

export default database;

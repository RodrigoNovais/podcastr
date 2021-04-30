/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { NextPage, GetStaticProps } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import { Episode } from '../database/config';

import { formatStringDate } from '../utils/format-string-date';
import { convertDurationToTimeString } from '../utils/convert-duration-to-time-string';

import { usePlayer } from '../contexts/PlayerContext';
import { server } from '../config';

import styles from '../styles/home.module.css';

export type HomePageProps = {
    latestEpisodes: [Episode, Episode];
    allEpisodes: Episode[];
};

const HomePage: NextPage<HomePageProps> = ({ allEpisodes, latestEpisodes }) => {
    const { playList } = usePlayer();

    const episodesList = [...latestEpisodes, ...allEpisodes];

    return (
        <div className={styles.homepage}>
            <section className={styles.latestEpisodes}>
                <h2>Últimos Lançamentos</h2>

                <ul>
                    {latestEpisodes.map((episode, index) => (
                        <li key={episode.id}>
                            <Image
                                height={192}
                                width={192}
                                objectFit='cover'
                                src={episode.thumbnail}
                                alt={episode.title} />

                            <div className={styles.episodeDetails}>
                                <Link href={`/episode/${episode.id}`}>
                                    <a>{episode.title}</a>
                                </Link>
                                <p>{episode.members}</p>
                                <span>{episode.published_at}</span>
                                <span>{convertDurationToTimeString(episode.file.duration)}</span>
                            </div>

                            <button type="button" onClick={() => { playList(episodesList, index); }}>
                                <img src="/play-green.svg" alt="Tocar episódio" />
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className={styles.allEpisodes}>
                <h2>Todos episódios</h2>

                <table cellSpacing={0}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Podcast</th>
                            <th>Integrantes</th>
                            <th>Data</th>
                            <th>Duração</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {allEpisodes.map((episode, index) => (
                            <tr key={episode.id}>
                                <td style={{ width: 72 }}>
                                    <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                                </td>
                                <td>
                                    <Link href={`/episode/${episode.id}`}>
                                        <a>{episode.title}</a>
                                    </Link>
                                </td>
                                <td>{episode.members}</td>
                                <td style={{ width: 100 }}>{episode.published_at}</td>
                                <td>{convertDurationToTimeString(episode.file.duration)}</td>
                                <td>
                                    <button type="button" onClick={() => { playList(episodesList, index + latestEpisodes.length); }}>
                                        <img src="/play-green.svg" alt="Tocar episódio" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async() => {
    const response = await fetch(`${server}/api/episodes?limit=12`);
    const data = await response.json() as Episode[];

    const episodes = data.map(episode => {
        return {
            ...episode,
            published_at: formatStringDate(episode.published_at, 'd MMM yy'),
        };
    });

    const latestEpisodes = episodes.slice(0, 2);
    const allEpisodes = episodes.slice(2, episodes.length);

    return {
        props: {
            allEpisodes,
            latestEpisodes,
        },

        revalidate: 60 * 60 * 8,
    };
};

export default HomePage;

import React from 'react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import { Episode } from '../../database/config';

import { formatStringDate } from '../../utils/format-string-date';
import { convertDurationToTimeString } from '../../utils/convert-duration-to-time-string';

import { usePlayer } from '../../contexts/PlayerContext';
import { server } from '../../config';

import styles from '../../styles/episodes.module.css';

export type EpisodePageProps = {
    episode: Episode;
};

const EpisodePage: NextPage<EpisodePageProps> = ({ episode }) => {
    const { play } = usePlayer();

    return (
        <div className={styles.episode}>
            <div>
                <div className={styles.thumbnailContainer}>
                    <Link href="/">
                        <button type="button">
                            <img src="/arrow-left.svg" alt="Voltar" />
                        </button>
                    </Link>

                    <Image
                        width={700}
                        height={260}
                        src={episode.thumbnail}
                        objectFit="cover" />

                    <button type="button" onClick={() => { play(episode); }}>
                        <img src="/play.svg" alt="Tocar Episódio" />
                    </button>
                </div>

                <header>
                    <h1>{episode.title}</h1>

                    <div>
                        <span>{episode.members}</span>
                        <span>{episode.published_at}</span>
                        <span>{convertDurationToTimeString(episode.file.duration)}</span>
                    </div>
                </header>

                <div className={styles.description}
                    dangerouslySetInnerHTML={{ __html: episode.description }} />
            </div>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async() => {
    const response = await fetch(`${server}/api/episodes?limit=12`);
    const data = await response.json() as Episode[];

    const episodes = data.map(episode => {
        return { params: { slug: episode.id }};
    });

    return {
        paths:    episodes,
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async({ params }) => {
    const response = await fetch(`${server}/api/episode/${params.slug}`);
    const data = await response.json() as Episode;

    const episode = {
        ...data,
        published_at: formatStringDate(data.published_at, 'd MMM yy'),
    };

    return {
        props:      { episode },
        revalidate: 60 * 60 * 24 * 7,
    };
};

export default EpisodePage;

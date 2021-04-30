/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';

import { convertDurationToTimeString } from '../../utils/convert-duration-to-time-string';

import styles from './styles.module.css';
import { Episode } from '../../database/config';

const Player: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState<number>(0);

    const {
        episodeList,
        currentEpisodeIndex,

        isLooping,
        isPlaying,
        isShuffling,

        toggleLoop,
        togglePlay,
        toggleShuffle,

        clearPlayerState,
        setPlayingState,

        playNext,
        playPrevious,

        hasNext,
        hasPrevious,
    } = usePlayer();

    const episode = episodeList[currentEpisodeIndex];

    const updatePositionState = (episode: Episode) => {
        if (!('mediaSession' in navigator)) return;
        if (!audioRef.current) return;

        navigator?.mediaSession?.setPositionState?.({
            duration:     episode.file.duration,
            playbackRate: audioRef.current?.playbackRate || 1,
            position:     audioRef.current?.currentTime || 0,
        });
    };

    const setupProgressListener = () => {
        if (!audioRef.current) return;

        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(audioRef.current.currentTime);
        });
    };

    const handleSeek = (amount: number) => {
        if (!audioRef.current) return;

        audioRef.current.currentTime = amount;
        setProgress(amount);
    };

    const handleEpisodeEnded = () => {
        if (!audioRef.current) return;
        if (hasNext) return playNext();

        clearPlayerState();
    };

    useEffect(() => {
        if (!audioRef.current) return;
        if (!isPlaying) return audioRef.current.pause();

        audioRef.current.play();

        if (!('mediaSession' in navigator)) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title:   episode.title,
            artist:  episode.members,
            artwork: [{ src: episode.thumbnail, type: 'image/jpg' }],
        });

        navigator.mediaSession?.setActionHandler('stop', clearPlayerState);
        navigator.mediaSession?.setActionHandler('previoustrack', hasPrevious ? playPrevious : undefined);
        navigator.mediaSession?.setActionHandler('nexttrack', hasNext ? playNext : undefined);

        const defaultSkipTimeInSeconds = 10;

        navigator.mediaSession?.setActionHandler('seekbackward', details => {
            const skipTime = details.seekOffset || defaultSkipTimeInSeconds;
            audioRef.current.currentTime = Math.max(audioRef.current.currentTime - skipTime, 0);
            updatePositionState(episode);
        });

        navigator.mediaSession?.setActionHandler('seekforward', details => {
            const skipTime = details.seekOffset || defaultSkipTimeInSeconds;
            audioRef.current.currentTime = Math.min(audioRef.current.currentTime + skipTime, audioRef.current.duration);
            updatePositionState(episode);
        });

        navigator.mediaSession?.setActionHandler('seekto', (details) => {
            if (details.fastSeek && 'fastSeek' in audioRef.current)
                return audioRef.current.fastSeek(details.seekTime);

            audioRef.current.currentTime = details.seekTime;
            updatePositionState(episode);
        });
    }, [clearPlayerState, episode, hasNext, hasPrevious, isPlaying, playNext, playPrevious]);

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        height={592}
                        width={592}
                        objectFit='cover'
                        src={episode.thumbnail}
                        alt={episode.title} />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    {episode ? (
                        <Slider
                            max={episode?.file.duration}
                            value={progress}
                            onChange={handleSeek}
                            trackStyle={{ backgroundColor: '#04d361' }}
                            railStyle={{ backgroundColor: '#9f75ff' }}
                            handleStyle={{ backgroundColor: '#04d361', borderWidth: 4 }} />
                    ) : (
                        <div className={styles.slider}>
                            <div className={styles.emptySlider} />
                        </div>
                    )}
                    <span>{convertDurationToTimeString(episode?.file.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio ref={audioRef} src={episode.file.url}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                        onEnded={handleEpisodeEnded}
                        loop={isLooping} autoPlay />)}

                <div className={styles.buttons}>
                    <button type="button" className={isShuffling ? styles.isActive : ''} onClick={toggleShuffle}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>

                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                        <img src={isPlaying ? '/pause.svg' : '/play.svg'} alt="Tocar" />
                    </button>

                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar proxima" />
                    </button>

                    <button type="button" className={isLooping ? styles.isActive : ''} onClick={toggleLoop}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Player;

import React, { createContext, useContext, useState } from 'react';

import { Episode } from '../database/config';

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;

    isLooping: boolean;
    isPlaying: boolean;
    isShuffling: boolean;

    toggleLoop: () => void;
    toggleShuffle: () => void;
    togglePlay: () => void;

    clearPlayerState: () => void;
    setPlayingState: (state: boolean) => void;

    play: (episode: Episode) => void;
    playList: (episodes: Episode[], index: number) => void
    playNext: () => void;
    playPrevious: () => void;

    hasNext: boolean;
    hasPrevious: boolean;
};

export const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

export const usePlayer = (): PlayerContextData => useContext(PlayerContext);

export const PlayerProvider: React.FC = ({ children }) => {
    const [episodeList, setEpisodeList] = useState<Episode[]>([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLooping, setIsLooping] = useState<boolean>(false);
    const [isShuffling, setIsShuffling] = useState<boolean>(false);

    const playList = (episodes: Episode[], index: number): void => {
        setEpisodeList(episodes);
        setCurrentEpisodeIndex(index);

        setIsPlaying(true);
    };

    const play = (episode: Episode): void => playList([episode], 0);

    const hasPrevious = currentEpisodeIndex > 0;
    const playPrevious = () => {
        if (!hasPrevious) return;

        setCurrentEpisodeIndex(index => index - 1);
    };

    const hasNext = isShuffling || currentEpisodeIndex < episodeList.length - 1;
    const playNext = () => {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            return setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }

        if (!hasNext) return;

        return setCurrentEpisodeIndex(index => index + 1);
    };

    const toggleLoop = () => setIsLooping(looping => !looping);
    const togglePlay = () => setIsPlaying(playing => !playing);
    const toggleShuffle = () => setIsShuffling(shuffling => !shuffling);

    const setPlayingState = (state: boolean) => setIsPlaying(state);
    const clearPlayerState = () => {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    };

    const data: PlayerContextData = {
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

        play,
        playList,
        playNext,
        playPrevious,

        hasNext,
        hasPrevious,
    };

    return (
        <PlayerContext.Provider value={data}>
            {children}
        </PlayerContext.Provider>
    );
};

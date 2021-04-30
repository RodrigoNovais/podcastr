import React from 'react';
import { AppProps } from 'next/app';

import Header from '../components/Header';
import Player from '../components/Player';

import { PlayerProvider } from '../contexts/PlayerContext';

import styles from '../styles/app.module.css';

import '../styles/globals.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
    <PlayerProvider>
        <div className={styles.appWrapper}>
            <main>
                <Header />
                <Component {...pageProps} />
            </main>

            <Player />
        </div>
    </PlayerProvider>
);

export default App;

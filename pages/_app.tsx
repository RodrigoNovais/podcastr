import React from 'react';
import { AppProps } from 'next/app';

import Header from '../components/Header';
import Player from '../components/Player';

import styles from '../styles/app.module.css';

import '../styles/globals.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
    <div className={styles.appWrapper}>
        <main>
            <Header />
            <Component {...pageProps} />
        </main>

        <Player />
    </div>
);

export default App;

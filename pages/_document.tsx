import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html lang="pt-br">
                <Head>
                    <meta charSet="UTF-8" />

                    <link rel="icon" href="/favicon.png" type="image/png" />
                    <link rel="shortcut icon" href="/favicon.png" type="image/png" />
                    <link rel="apple-touch-icon" href="/favicon.png" type="image/png" />

                    <meta name="author" content="Rodrigo Novais" />

                    <meta name="theme-color" content="#9f75ff" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

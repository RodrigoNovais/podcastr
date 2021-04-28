const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://192.168.15.10:3000' : process.env.NEXT_PUBLIC_HOST;

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true
    },
    env: {
        NEXT_PUBLIC_BASE_PATH: '',
    }
};

export default nextConfig;

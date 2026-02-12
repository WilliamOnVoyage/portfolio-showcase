const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    output: 'export',
    basePath: isProd ? '/portfolio-showcase' : '',
    images: {
        unoptimized: true
    },
    env: {
        NEXT_PUBLIC_BASE_PATH: isProd ? '/portfolio-showcase' : '',
    }
};

export default nextConfig;

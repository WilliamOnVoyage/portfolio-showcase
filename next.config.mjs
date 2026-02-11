const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    output: 'export',
    basePath: isProd ? '/portfolio-showcase' : '',
    images: {
        unoptimized: true
    }
};

export default nextConfig;

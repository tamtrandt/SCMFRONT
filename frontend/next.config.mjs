/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    webpack: (config) => {

        config.module.rules.push({
            test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['next/babel'],
                    plugins: [['styled-components', { ssr: true }]],
                },
            },
        });

        return config;
    },
    experimental: {

    },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,  // Kích hoạt styled-components nếu cần
    },
    webpack: (config) => {
        // Tùy chỉnh Webpack để sử dụng Babel
        config.module.rules.push({
            test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['next/babel'],
                    plugins: [['styled-components', { ssr: true }]],  // Plugin cho styled-components
                },
            },
        });

        return config;
    },
};

export default nextConfig;

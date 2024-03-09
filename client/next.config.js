const removeImports = require("next-remove-imports")
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
        ...removeImports(),
        modularizeImports: {
            "react-icons/(\\w*)/?": {
                transform: "@react-icons/all-files/{{ matches.[1] }}/{{ member }}",
                skipDefaultConversion: true
        }
        },
        async redirects() {
            return [
                { 
                    source: "/problems/:slug",
                    destination: "/problems/:slug/description",
                    permanent: true,
                },
                { 
                    source: "/",
                    destination: "/problems",
                    permanent: true,
                },
                { 
                    source: "/login",
                    destination: "/problems",
                    has: [{
                        type : 'cookie',
                        key: 'jwt'
                    }],
                    permanent: false,
                },
                { 
                    source: "/signup",
                    destination: "/problems",
                    has: [{
                        type : 'cookie',
                        key: 'jwt'
                    }],
                    permanent: false,
                },
                { 
                    source: "/social/signup",
                    destination: "/problems",
                    has: [{
                        type : 'cookie',
                        key: 'jwt'
                    }],
                    permanent: false,
                }
            ]
        },
        images: {
            remotePatterns: [
                {
                    protocol: "https",
                    hostname: "firebasestorage.googleapis.com",
                    port: '',
                    pathname: '/v0/b/tesla-clone-a0f5d.appspot.com/**'
                },
                {
                    protocol: "https",
                    hostname: "lh3.googleusercontent.com",
                    port: '',
                    pathname: '/**'
                }
            ]
        }
    }

module.exports = nextConfig
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
                }
            ]
        }
    }

module.exports = nextConfig
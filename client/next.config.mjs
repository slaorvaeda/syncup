/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/posts",
        destination: "/admin/posts",
        permanent: true,
      },
      {
        source: "/posts/:feedId",
        destination: "/admin/posts/:feedId",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

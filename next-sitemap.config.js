/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://simulasi.studio/", // Trailing slash added. Corrected URL.
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // exclude: ['/server-sitemap.xml'],
  // robotsTxtOptions: {
  //   additionalSitemaps: [
  //     "https://simulasi.studio/" + "/server-sitemap.xml", // Hardcoded URL for consistency
  //   ],
  // },
};

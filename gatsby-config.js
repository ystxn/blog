module.exports = {
  siteMetadata: {
    title: `Today YS Learned..`,
    author: {
      name: `Yong Sheng Tan`,
      summary: `from sunny Singapore. All thoughts, opinions, code and other media are expressed here on a personal basis and do not represent any entity or person other than himself.`,
    },
    description: `daily tinkers with software, infrastructure, coffee, running and photography`,
    siteUrl: `https://blog.yong.space`,
    social: {
      twitter: `ystan_`,
      linkedin: `tanys`
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/pages`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: true
            }
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    /*
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    */
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Today YS Learned..`,
        short_name: `YS Blog`,
        start_url: `/`,
        background_color: `#1e1e1e`,
        theme_color: `lightseagreen`,
        display: `standalone`,
        icon: `content/assets/rocket.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-plugin-offline`,
  ],
}

// const withCSS = require('@zeit/next-css'); // @ deprecated
// module.exports = withCSS({
//     publicRuntimeConfig: {
//         APP_NAME: 'SEOBLOG',
//         API_DEVELOPMENT: 'http://localhost:8000/api',
//         PRODUCTION: false
//     }
// });

/* writing environment variables for nextjs */
module.exports = {
    publicRuntimeConfig: {
        APP_NAME: 'SEOBLOG',
        API_DEVELOPMENT: 'http://localhost:8000/api',
        API_PRODUCTION: 'https://seoblog.com/api',
        PRODUCTION: false,
        DOMAIN_DEVELOPMENT: 'http://localhost:3000',
        DOMAIN_PRODUCTION: 'https://seoblog.com',
        FB_APP_ID: '517904876628131' // SEOBLOG_LOCAL FB APP
    }
};

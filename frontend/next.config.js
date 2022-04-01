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
        PRODUCTION: false
    }
};

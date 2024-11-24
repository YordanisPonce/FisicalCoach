const fs = require('fs');
const writeFile = fs.writeFile;
const { argv } = require('yargs');
// Configure Angular `environment.prod.ts` file path

const environment = argv.environment;
const targetPath = './src/environments/environment.prod.ts';

// Load node modules 
require('dotenv').config();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
   production: ${process.env.PRODUCTION},
   API_URL: '${process.env.API_URL}',
   GOOGLE_OAUTH_API_KEY: '${process.env.GOOGLE_OAUTH_API_KEY}',
   images: '${process.env.images}',
   resourcesIframe: '${process.env.resourcesIframe}',
   WS_HOST: '${process.env.WS_HOST}',
   PUSHER_KEY: '${process.env.PUSHER_KEY}',
   PUSHER_CLUSTER: '${process.env.PUSHER_CLUSTER}',
   STRIPE_TOKEN: '${process.env.STRIPE_TOKEN}'
};
`; 
writeFile(targetPath, envConfigFile, function (err: any) {
    if (err)
    {
        console.log('error', err);
    } else
    {
        console.log('working');
    }
});
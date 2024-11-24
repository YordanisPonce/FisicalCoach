// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'https://api.fisicalcoach.com/api/v1/',
  //API_URL: 'http://localhost:8083',
  GOOGLE_OAUTH_API_KEY:
    '1011554830890-djple5daq7put9bf6735flrd895fg57n.apps.googleusercontent.com',
  images: 'https://testing-cdn.fisicalcoach.com/resources/',
  resourcesIframe: 'https://testing-cdn.fisicalcoach.com/resources/',
  WS_HOST: '161.35.106.160:6061',
  PUSHER_KEY: '89ee589908a626aa3ba8',
  PUSHER_CLUSTER: 'mt1',
  STRIPE_TOKEN:
    'pk_test_51ISlHGK6ttgcW7bgO4tZlypfjhfVOpmMtgDoKYPz5CAYKlMdWtNBcaFa9ZyGTl6Q9pexZwsMdVOQmZPK8ok5DpFs00PGjUM6eo',
};
// agrego dos lineas para hacer un commit
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

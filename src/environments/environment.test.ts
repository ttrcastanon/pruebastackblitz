// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import * as AppConstants from '../app/app-constants';

export const environment = {
  production: true,
  defaultDomain: '',
  filesAzure: window['filesAzure'] || true,
  urlStorageAzure: window['urlStorageAzure'] || 'https://devcasbalstorageaccount.blob.core.windows.net/',
  endpoints: {
    WebApi: window['WebApi'] || 'http://localhost:9020/',
    CloudPDF: window['CloudPDF']
  },
  apiKeyGoogleMaps: 'AIzaSyA3Jo3ZkCJUbyBdlnXmk9ZJVb9eYlHtGvc',
  urlpublicaimagenes: 'http://172.107.204.246/WebApivics',
  UrlCalendario: 'https://vicscalendarioqa.azurewebsites.net'

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

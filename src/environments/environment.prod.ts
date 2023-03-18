
/*
 * Declaring the keys in the endpoints dictionary using AppConstants and brackets is no longer supported
 * as of 2/18/2019 when doing AOT compiling. Thus, I'm replacing the keys with hardcoded values. This may
 * change in the future - ppolcher.
 */
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
  urlpublicaimagenes: 'https://devvicsapi.azurewebsites.net/',
  UrlCalendario: 'https://vicscalendariouat.azurewebsites.net'

};

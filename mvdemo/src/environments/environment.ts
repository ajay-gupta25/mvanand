// Enums
import { EnvName } from '@enums/environment.enum';

// Packages
import packageInfo from '../../package.json';

const scheme = 'https://';
const host = 'app.qevalpro.ai';
const authUrl:string = `${scheme}${host}`;
const companyUrl:string = `${scheme}${host}`;
const orgUrl:string = `${scheme}${host}`;
const userUrl:string = `${scheme}${host}`;
const roleUrl:string = `${scheme}${host}`;
const folderUrl = `${scheme}${host}`;
const applicationUrl:string = `${scheme}${host}`;
const categoriesUrl:string = `${scheme}${host}`;

// const scheme = 'http://';
// const host = 'localhost';
// const authUrl = `${scheme}${host}:3002`;
// const companyUrl = `${scheme}${host}:3004`;
// const orgUrl = `${scheme}${host}:3001`;
// const userUrl = `${scheme}${host}:3003`;
// const roleUrl:string = `${scheme}${host}:3006`;
// const folderUrl = `${scheme}${host}:3005`;
// const applicationUrl:string = `${scheme}${host}:3008`;
// const categoriesUrl:string = `${scheme}${host}:3009`;




export const environment = {
  production: false,
  version: packageInfo.version,
  appName: 'MvAnand',
  envName: EnvName.LOCAL,
  defaultLanguage: 'en',
  apiBaseUrl:authUrl,
  apiBaseUrlCompany:companyUrl,
  apiBaseUrlOrg:orgUrl,
  apiBaseUrluser:userUrl,
  apiBaseUrlRole:roleUrl,
  apiBaseUrlFolder:folderUrl,
  apiBaseUrlApplication:applicationUrl,
  apiBasecategoriesUrl:categoriesUrl,
};

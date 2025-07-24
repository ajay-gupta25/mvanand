// move to mvdemo and then
// before generating build make changes in file: mvdemo/src/app/shared/services/auth/google-auth.service.ts
// and make changes in "authConfig" object and set redirectUri of server required

//----------AI suggested steps ------------------------//
// then run the command: ng build --output-path docs --base-href /mvanand/
// after that copy the docs folder to mvanand repo
// and then commit the changes in mvanand repo
// and then push the changes to mvanand repo
// after that go to mvanand repo and then run the command: git subtree push --prefix=gh-pages origin main
// this will push the changes to gh-pages branch of mvanand repo
// after that go to settings of mvanand repo and then set the source to
// gh-pages branch and then save the changes
// after that go to the url: https://ajay-gupta25.github.io/mvanand/
// and you will see the changes reflected there
// if you want to test the changes locally then run the command: ng serve --open
// and it will open the app in your default browser
// if you want to test the changes in production then run the command: ng build --prod
// and it will generate the build in the dist folder
// after that copy the dist folder to mvanand repo
// and then commit the changes in mvanand repo
// and then push the changes to mvanand repo
//----------AI suggested steps ------------------------//


// ng build command: ng build --output-path docs --base-href /mvanand/
// after that copy the docs folder to mvanand repo and then push the changes to mvanand repo
// Do not forget to change the redirectUri in mvdemo/src/app/shared/services/auth/google-auth.service.ts file 
// back to window.location.origin to run the local

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
  version: "0.0.2",
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

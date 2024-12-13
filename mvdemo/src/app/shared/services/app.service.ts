// Angular modules
import { Injectable }               from '@angular/core';
import { Router }                   from '@angular/router';

// External modules
import { TranslateService }         from '@ngx-translate/core';
import axios, { AxiosError, AxiosInstance, CreateAxiosDefaults } from 'axios';

// Internal modules
import { ToastManager }             from '@blocks/toast/toast.manager';
import { environment }              from '@env/environment';

// Helpers

// Enums

// Models
import { HttpHeaders } from '@angular/common/http';

// Services
import { StoreService }             from './store.service';

@Injectable()
export class AppService
{ 

  // NOTE Default configuration
  private default : CreateAxiosDefaults = {
    withCredentials : true,
    timeout : 990000,
    headers : {
      'Content-Type' : 'application/json',
      'Accept'       : 'application/json',
    },
  };

  // NOTE Instances
  private api : AxiosInstance = axios.create({
    baseURL : environment.apiBaseUrl,
    ...this.default,
  });

  // NOTE Controller
  private controller : AbortController = new AbortController();

  constructor
  (
    private storeService     : StoreService,
    private toastManager     : ToastManager,
    private router           : Router,
    private translateService : TranslateService,
  )
  {
    this.initRequestInterceptor(this.api);
    this.initResponseInterceptor(this.api);
  }

  // ----------------------------------------------------------------------------------------------
  // SECTION Methods ------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------

  public async authenticate(email : string, password : string) : Promise<boolean>
  {
    return Promise.resolve(true);
  }

  public async forgotPassword(email : string) : Promise<boolean>
  {
    return Promise.resolve(true);
  }
  public async resetPassword(email : string) : Promise<boolean>
  {
    return Promise.resolve(true);
  }

  public async validateAccount(token : string, password : string) : Promise<boolean>
  {
    return Promise.resolve(true);
  }

  // !SECTION Methods

  // ----------------------------------------------------------------------------------------------
  // SECTION Helpers ------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------

  public initRequestInterceptor(instance : AxiosInstance) : void
  {
    instance.interceptors.request.use((config) =>
    {
      this.storeService.setIsLoading(true);

      return config;
    },
    (error) =>
    {
      this.storeService.setIsLoading(false);

      this.toastManager.quickShow(error);
      return Promise.reject(new Error(error));
    });
  }

  public initResponseInterceptor(instance : AxiosInstance) : void
  {
    instance.interceptors.response.use((response) =>
    {
      this.storeService.setIsLoading(false);

      return response;
    },
    async (error : AxiosError) =>
    {
      this.storeService.setIsLoading(false);

      // NOTE Prevent request canceled error
      if (error.code === 'ERR_CANCELED')
        return Promise.resolve(error);

      this.toastManager.quickShow(error.message);
      return Promise.reject(error);
    });
  }
  public createHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders();
  //  let auth_token = localStorage.getItem("auth_token")
  let auth_token = localStorage.getItem("auth_token")
    // Include the JWT token in the headers
    if (auth_token) {
      headers = headers.set('Authorization', `Bearer ${auth_token}`);
    }

    // Set Content-Type to application/json
    headers = headers.set('Content-Type', 'application/json');
    
    // Include custom headers if provided
    if (customHeaders) {
      customHeaders.keys().forEach(key => {
        headers = headers.set(key, customHeaders.get(key)!);
      });
    }

    return headers;
  }

  public creatfileeHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders();
    let auth_token = localStorage.getItem("auth_token")
    // Include the JWT token in the headers
    if (auth_token) {
      headers = headers.set('Authorization', `Bearer ${auth_token}`);
    }
  return headers
  }
  
  // !SECTION Helpers
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {AppService} from './app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private appService:AppService) { }
  private apiUrl = environment.apiBaseUrluser + '/user'; // Replace with your actual API endpoint


  getUsers(page?: number, limit?: number,customHeaders?: HttpHeaders): Observable<any> {
    let queryParams = '';
    if (page !== undefined && limit !== undefined) {
      queryParams = `?page=${page}&limit=${limit}`;
    }
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/list${queryParams}`,{ headers });
  }
  getUserDetail(userId:string,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}`, { headers });
  }
  getdepartments(customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/deparments`,{ headers });
  }
  addUsers(userdata,customHeaders?: HttpHeaders): Observable<any> {
    const headers =this.appService.creatfileeHeaders();
    return this.http.post<any[]>(`${this.apiUrl}/create`,userdata,{ headers });
  }
  updateUsers(userId,userdata,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.creatfileeHeaders();
    return this.http.put<any[]>(`${this.apiUrl}/${userId}`,userdata,{ headers });
  }

  deleteUser(userId: string, customHeaders?: HttpHeaders): Observable<void> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, { headers });
  }

  getUsersByLocation(location:string,customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/list?location=${location}`, { headers });
  }

  // filterUsersById(Obj:Object,customHeaders?: HttpHeaders): Observable<any[]> {
  //   let urlParams = '';
  
  //   for (const key in Obj) {
  //     switch (key) {
  //       case 'search':
  //         urlParams += `search=${Obj[key]}&`;
  //         break;
  //       case 'location':
  //         urlParams += `location=${Obj[key]}&`;
  //         break;
  //       case 'status':
  //         urlParams += `status=${Obj[key]}&`;
  //         break;
  //       case 'company_id':
  //         urlParams += `company_id=${Obj[key]}&`;
  //         break;
  //       case 'page':
  //         urlParams += `page=${Obj[key]}&`;
  //         break;
  //       case 'limit':
  //         urlParams += `limit=${Obj[key]}&`;
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  //   const headers = this.appService.createHeaders(customHeaders);
  //   return this.http.get<any[]>(`${this.apiUrl}/list${urlParams.length > 0 ? '?' + urlParams : ''}`, { headers });
  // }

  getLocations(customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/locations`, { headers });
  }

  filterUsers(Obj:object,customHeaders?: HttpHeaders): Observable<any[]> {
    let urlParams = '';
  
    for (const key in Obj) {
      if (Obj[key] !== null && Obj[key] !== undefined && Obj[key] !== '') {
        switch (key) {
          case 'search':
            if(urlParams) urlParams += '&';
            urlParams += `search=${Obj[key]}`;
            break;
          case 'location':
            if(urlParams) urlParams += '&';
            urlParams += `location=${Obj[key]}`;
            break;
          case 'status':
            if(urlParams) urlParams += '&';
            urlParams += `status=${Obj[key]}`;
            break;
          case 'company_id':
            if(urlParams) urlParams += '&';
            urlParams += `company_id=${Obj[key]}`;
            break;
            case 'sort':
              if(urlParams) urlParams += '&';
            urlParams += `sort=${Obj[key]}`;
            break;
          case 'page':
            if(urlParams) urlParams += '&';
            urlParams += `page=${Obj[key]}`;
            break;
          case 'limit':
            if(urlParams) urlParams += '&';
            urlParams += `limit=${Obj[key]}`;
            break;
          default:
            break;
        }
      }
    }
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/list${urlParams.length > 0 ? '?' + urlParams : ''}`, { headers });
  }

  filterUsersByStatus(status:string,customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/list?status=${status}`, { headers });
  }

  importUsers(userdata:File,customHeaders?: HttpHeaders): Observable<any> {
  const formData:FormData = new FormData();
  formData.append('filePath', userdata);
    let headers = this.appService.creatfileeHeaders();
    return this.http.post<any>(`${this.apiUrl}/import-users`,formData,{headers});
  }

  changePassword(data:any,customHeaders?: HttpHeaders){
    let headers = this.appService.creatfileeHeaders();
    return this.http.post<any[]>(`${this.apiUrl}/changed-password`,data,{ headers });
  }

  getUserProfile(userId:string,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}`, { headers });
  }

  UpdateProfile(userId,userdata,customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.creatfileeHeaders();
    return this.http.put<any[]>(`${this.apiUrl}/profile/${userId}`,userdata,{ headers });
  }

}

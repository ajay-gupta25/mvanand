import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = environment.apiBaseUrlRole + '/role'; // Replace with your actual API endpoint
  constructor(private http: HttpClient, private appService: AppService) { }

  getRolesList(customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/get-roles-list`, { headers });
  }

  getRolesByCompany(companyId: any, customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/get-roles-by-company/${companyId}`, { headers });
  }

  getRoles(page?:number,limit?:number,customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    let queryParams = '';
    if (page !== undefined && limit !== undefined) {
      queryParams = `?page=${page}&limit=${limit}`;
    }
    return this.http.get<any[]>(`${this.apiUrl}/roles${queryParams}`, { headers });
  }

  createRole(name: any, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.post<any>(`${this.apiUrl}/create-role`, name, { headers });
  }

  deleteRole(roleId: string, customHeaders?: HttpHeaders): Observable<void> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.delete<void>(`${this.apiUrl}/delete-role/${roleId}`, { headers });
  }

  updateRole(roleId: any, role: any, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.put<any>(`${this.apiUrl}/update-role/${roleId}`, role, { headers });
  }

  getPermissionsByRoleId(roleId: any, customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/roles/${roleId}`, { headers });
  }


  updatePermission(roleId: any, permission: any, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.put<any>(`${this.apiUrl}/update-permission/${roleId}`, permission, { headers });
  }

  filterRoles(search:string,customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/roles?search=${search}`, { headers });
  }


}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '@env/environment';
import { AppService } from './app.service';


interface CompanyListApiResponse {
  success: number;
  message: string;
  data:    CompanyList[];
}

interface CompanyList {
  _id:          string;
  company_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = environment.apiBaseUrlCompany + '/company'; // Replace with your actual API endpoint
  public cachedCompanyList: CompanyListApiResponse;

  constructor(private http: HttpClient, private appService: AppService) { }

  getCompanies(page?:number,limit?:number,customHeaders?: HttpHeaders): Observable<any[]> {
    let queryParams = '';
    if (page !== undefined && limit !== undefined) {
      queryParams = `?page=${page}&limit=${limit}`;
    }
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/companies${queryParams}`, { headers });
  }

  createCompany(company: any, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.post<any>(`${this.apiUrl}/create-company`, company, { headers }).pipe(
      tap(() => this.clearCompanyListCache())
    );
  }

  updateCompany(companyId: string, company: any, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.put<any>(`${this.apiUrl}/update-company/${companyId}`, company, { headers }).pipe(
      tap(() => this.clearCompanyListCache())
    );
  }

  deleteCompany(companyId: string, customHeaders?: HttpHeaders): Observable<void> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.delete<void>(`${this.apiUrl}/delete-company/${companyId}`, { headers }).pipe(
      tap(() => this.clearCompanyListCache())
    );
  }

  getLocations(customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/locations`, { headers });
  }

  filterCompanies(Obj:Object,customHeaders?: HttpHeaders): Observable<any[]> {
    let urlParams = ''
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
    return this.http.get<any[]>(`${this.apiUrl}/companies${urlParams.length > 0 ? '?' + urlParams : ''}`, { headers });
  }

  getCompanyList(customHeaders?: HttpHeaders): Observable<CompanyListApiResponse> {
      const headers = this.appService.createHeaders(customHeaders);
      return this.http.get<CompanyListApiResponse>(`${this.apiUrl}/get-companies-list`, { headers }).pipe(
        tap((res: CompanyListApiResponse) => this.cachedCompanyList = res)
      );
    
  }

  private clearCompanyListCache(): void {
    this.cachedCompanyList = {} as CompanyListApiResponse;
  }
}

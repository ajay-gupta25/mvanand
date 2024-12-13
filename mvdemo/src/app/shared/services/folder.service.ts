import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of, tap } from 'rxjs';
import { AppService } from './app.service';

interface FolderListApiResponse {
  success: number;
  message: string;
  data:    FolderList[];
}

interface FolderList {
  _id:          string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private apiUrl = environment.apiBaseUrlFolder + '/folder'; // Replace with your actual API endpoint
  public cachedFolderList: FolderListApiResponse;

  constructor(private http: HttpClient, private appService: AppService) { }

  getFolders(page?: number, limit?: number, customHeaders?: HttpHeaders): Observable<any[]> {
    let queryParams = '';
    if (page !== undefined && limit !== undefined) {
      queryParams = `?page=${page}&limit=${limit}`;
    }
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/folders${queryParams}`, { headers });
  }

  createFolder(folder: any, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.post<any>(`${this.apiUrl}/create-folder`, folder, { headers }).pipe(
      tap(()=> this.clearFolderListCache())
    );
  }

  getFolderDetails(folderId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/folders/folder/${folderId}`, { headers });
  }

  updateFolder(folderId: string, folder: any, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.put<any>(`${this.apiUrl}/update-folder/${folderId}`, folder, { headers }).pipe(
      tap(()=> this.clearFolderListCache())
    );
  }

  deleteFolder(folderId: string, customHeaders?: HttpHeaders): Observable<void> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.delete<void>(`${this.apiUrl}/delete-folder/${folderId}`, { headers }).pipe(
      tap(() => this.clearFolderListCache())
    );
  }

  foldersByCompanyId(companyId: string, customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/folder-name-list/${companyId}`, { headers });
  }

  filterCompaniesById(companyId: string, customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/folders?companyId=${companyId}`, { headers });
  }

  filterOrganizationsById(org_id: string, customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/folders?org_id=${org_id}`, { headers });
  }

  // filterFolders(search: string, customHeaders?: HttpHeaders): Observable<any[]> {
  //   const headers = this.appService.createHeaders(customHeaders);
  //   return this.http.get<any[]>(`${this.apiUrl}/folders?search=${search}`, { headers });
  // }

  filterOrganizationsByDate(createdAt: string, customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/folders?createdAt=${createdAt}`, { headers });
  }

  filterFolders(Obj: Object, customHeaders?: HttpHeaders): Observable<any[]> {
    let urlParams = ''
    for (const key in Obj) {
      if (Obj[key] !== null && Obj[key] !== undefined && Obj[key] !== '') {
        switch (key) {
          case 'search':
            if(urlParams) urlParams += '&';
            urlParams += `search=${Obj[key]}`;
            break;
          case 'companyId':
            if(urlParams) urlParams += '&';
            urlParams += `companyId=${Obj[key]}`;
            break;
          case 'org_id':
            if(urlParams) urlParams += '&';
            urlParams += `org_id=${Obj[key]}`;
            break;
          case 'createdAt':
            if(urlParams) urlParams += '&';
            urlParams += `createdAt=${Obj[key]}`;
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
    return this.http.get<any[]>(`${this.apiUrl}/folders${urlParams.length > 0 ? '?' + urlParams : ''}`, { headers });
  }


  getProcessLogs(Obj: Object, folderId: string, customHeaders?: HttpHeaders): Observable<any[]> {
    let urlParams = ''
    for (const key in Obj) {
      if (Obj[key] !== null && Obj[key] !== undefined && Obj[key] !== '') {
        switch (key) {
          case 'search':
            if(urlParams) urlParams += '&';
            urlParams += `search=${Obj[key]}`;
            break;
          case 'createdAt':
            if(urlParams) urlParams += '&';
            urlParams += `createdAt=${Obj[key]}`;
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
    return this.http.get<any[]>(`${this.apiUrl}/process-logs/${folderId}${urlParams.length > 0 ? '?' + urlParams : ''}`, { headers });
  }


  uploadMetadata(selectedFile: File, folderId: string, customHeaders?: HttpHeaders): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('filePath', selectedFile);
    formData.append('folderId', folderId);
    const headers = this.appService.creatfileeHeaders();
    return this.http.post<any>(`${this.apiUrl}/uploadMetaData`, formData, { headers });
  }
  getProgressLogCount(folderId: string, customHeaders?: HttpHeaders): Observable<any[]> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/process-logs-counts/${folderId}`, { headers });
  }

  // Not in use : Deprecated on 6-Aug-24
  getCallFiles(params, customHeaders?: HttpHeaders): Observable<any> {
    const queryParams = this.buildQueryString(params);
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/call-files${queryParams}`, { headers });
  }

  // Data fetched using ElasticSearch : Cloned from <getCallFiles>
  getElasticCallFiles(params, customHeaders?: HttpHeaders): Observable<any> {
    const queryParams = this.buildQueryString(params);
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/filter-elastic-callfiles${queryParams}`, { headers });
  }
  getFolderByorganisationID(params, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/folder-name-list-by-organization/${params}`, { headers });
  }

  getFolderList(customHeaders?: HttpHeaders): Observable<FolderListApiResponse> {
    if (this.cachedFolderList && Object.keys(this.cachedFolderList).length) {
      return of(this.cachedFolderList);
    } else {
      const headers = this.appService.createHeaders(customHeaders);
      return this.http.get<FolderListApiResponse>(`${this.apiUrl}/folders-list`, { headers }).pipe(
        tap((res: FolderListApiResponse) => this.cachedFolderList = res)
      );
    }
  }

  private clearFolderListCache(): void {
    this.cachedFolderList = {} as FolderListApiResponse;
  }

  private buildQueryString(params: any): string {
    const queryEntries = Object.entries(params).filter(([key, value]) => value !== undefined && value !== null);
    const queryString = queryEntries.map(([key, value]) => {
      if (typeof value === 'object') {
        // Convert object to JSON string
        return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
      } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        // Handle primitive types
        return `${key}=${encodeURIComponent(value.toString())}`;
      } else {
        // Handle any other cases (e.g., symbols, functions) if necessary
        return '';
      }
    }).filter(entry => entry !== '').join('&');
    return queryString ? `?${queryString}` : '';
  }

  deleteCallFileApiCall(callFileId: string, customHeaders?: HttpHeaders): Observable<void> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.delete<void>(`${this.apiUrl}/delete-callfile/${callFileId}`, { headers });
  }

  saveFilterApiCall(params: any, customHeaders?: HttpHeaders): Observable<void> {
    const headers = this.appService.creatfileeHeaders();
    return this.http.post<any>(`${this.apiUrl}/create-filter`, params, { headers });
  }

  getFilterListApiCall(customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/call-files/filters-list`, { headers });
  }

  getFilterApiCall(params: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/call-files/filter-details/${params}`, { headers });
  }

  updateFilterApiCall(params: unknown, filterId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.put<any>(`${this.apiUrl}/filter-update/${filterId}`, params, { headers });
  }

  getCallApidetails(params: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/call-files/callfile-details/${params}`, { headers });
  }

  getTagsByCallId(callId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/tags-list/${callId}`, { headers });
  }

  deleteTag(tagId: string, customHeaders?: HttpHeaders): Observable<void> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.delete<void>(`${this.apiUrl}/delete-tag/${tagId}`, { headers });
  }

  createTag(tag: any, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.post<any>(`${this.apiUrl}/create-tag`, tag, { headers });
  }

  getTagsBySearch(callId: string, searchVal: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/tags-list/${callId}?search=${searchVal}`, { headers });
  }

  //dashboard 
  getCallsCount(queryParam: any, customHeaders?: HttpHeaders): Observable<any[]> {
    queryParam = this.joinQueryParam(queryParam);
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/dashboard?${queryParam}`, { headers });
  }

  getAppScoreByCallId(callId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/application-score/${callId}`, { headers });
  }
  
  exportCallFiles(callIds: {callIds: any[]}, customHeaders?: HttpHeaders) {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.post<any>(`${this.apiUrl}/export-callfiles`, callIds, { headers, responseType: 'blob' as 'json' });
  }

  getPresignedUrl(callId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/get-presign-url/${callId}`, { headers });
  }


  fetchAudioFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  getMetaData(folderId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/get-metadata/${folderId}`, { headers });
  }
  dowloadaudio(folderId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/download-audio/${folderId}`, { headers });
  }

  getCallFilesWithElasticSearch(queryParam: any, customHeaders?: HttpHeaders): Observable<any[]> {
    queryParam = this.joinQueryParam(queryParam);
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any[]>(`${this.apiUrl}/filter-elastic-callfiles?${queryParam}`, { headers });
  }

  private joinQueryParam(queryParam) {
    return Object.keys(queryParam)
    .map(key => `${key.toString()}=${queryParam[key]}`)
    .join('&');
  }

  getAppCoverageByCallId(callId: string, customHeaders?: HttpHeaders): Observable<any> {
    const headers = this.appService.createHeaders(customHeaders);
    return this.http.get<any>(`${this.apiUrl}/application-coverage/${callId}`, { headers });
  }
}

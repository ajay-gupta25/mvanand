import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of, tap } from 'rxjs';
// import { Organization } from 'src/app/pages/modules/organization/organization.model';
import { AppService } from './app.service';

interface OrgListApiResponse {
  success: number;
  message: string;
  data:    OrgList[];
}

interface OrgList {
  _id:          string;
  org_name: string;
}


@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = environment.apiBaseUrlOrg + '/organization'; // Replace with your actual API endpoint
  public cachedOrgList: OrgListApiResponse;
 
}

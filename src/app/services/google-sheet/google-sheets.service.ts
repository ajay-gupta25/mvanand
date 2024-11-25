import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GoogleAuthService } from '../auth/google-auth.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleSheetsService {
  private apiKey = 'AIzaSyA2mrYyZestnVjIjt4xHKTDrbfQjmPn0bU';
  private sheetId = '1Eb_LL_JDmW2k6lj0CNkNSOKGVQmgXpjXRqvffFpvi0I';
  private baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values`;

  constructor(private http: HttpClient,
    private authService: GoogleAuthService) {}

    getSheetData(sheetName: string): Observable<any> {
      const accessToken = this.authService.getToken;
      console.log(accessToken);
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
  
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
  
      return this.http.get(url, { headers });
    }
    getSheetData1(sheetName: string): Observable<any> {
      const url = `${this.baseUrl}/${sheetName}?key=${this.apiKey}`;
      return this.http.get(url);
    }

    appendData1(sheetName: string, values: any[][]): Observable<any> {
      const url = `${this.baseUrl}/${sheetName}:append?valueInputOption=RAW&key=${this.apiKey}`;
      const body = { values };
      return this.http.post(url, body);
    }
  
    updateSheetData(sheetName: string, range: string, values: any[][]): Observable<any> {
      const accessToken = this.authService.getToken;
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
  
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}!${range}?valueInputOption=RAW`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      });
  
      const body = {
        values: values,
      };
  
      return this.http.put(url, body, { headers });
    }
  
    appendSheetData(sheetName: string, values: any[][]): Observable<any> {
      const accessToken = this.authService.getToken;
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
  
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}:append?valueInputOption=RAW`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      });
  
      const body = {
        values: values,
      };
  
      return this.http.post(url, body, { headers });
    }
}

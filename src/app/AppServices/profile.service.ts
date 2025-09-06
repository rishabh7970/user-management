import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profilesUrl = 'http://localhost:3000/profiles';

  constructor(private http: HttpClient) { }

  getProfiles(): Observable<any[]> {
    return this.http.get<any[]>(this.profilesUrl);
  }

  addProfile(profileName: string): Observable<any> {
    return this.http.post<any>(this.profilesUrl, { name: profileName });
  }

  deleteProfile(profileName: string): Observable<any> {
    return this.http.delete<any>(`${this.profilesUrl}/${profileName}`);
  }
}
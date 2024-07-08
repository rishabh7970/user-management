import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profilesKey = 'userProfiles';

  constructor() { }

  getProfiles(): Observable<any[]> {
    const profiles = localStorage.getItem(this.profilesKey);
    return of(profiles ? JSON.parse(profiles) : [{ name: 'Profile1' }, { name: 'Profile2' }]);
  }

  saveProfiles(profiles: any[]): void {
    localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
  }

  addProfile(profileName: string): Observable<void> {
    return new Observable<void>(observer => {
      this.getProfiles().subscribe(profiles => {
        if (!profiles.some(profile => profile.name === profileName)) {
          profiles.push({ name: profileName });
          this.saveProfiles(profiles);
        }
        observer.next();
        observer.complete();
      });
    });
  }

  deleteProfile(profileName: string): Observable<void> {
    return new Observable<void>(observer => {
      this.getProfiles().subscribe(profiles => {
        const updatedProfiles = profiles.filter(profile => profile.name !== profileName);
        this.saveProfiles(updatedProfiles);
        observer.next();
        observer.complete();
      });
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:3000/users';

    constructor(private http: HttpClient) { }

    getUserList(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    addNewUser(user: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, user);
    }

    updateUser(userId: number, user: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${userId}`, user);
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${userId}`);
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface User {
  id: number;
  email: string;
  password: string;
  rol: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  public getUser(username: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(
      environment.apiurl + '/users?email=' + username + '&password=' + password
    );
  }
}

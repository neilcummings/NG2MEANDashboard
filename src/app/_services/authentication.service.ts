import { Injectable } from '@angular/core';
import {Http, RequestOptions, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class AuthenticationService {
  jwtHelper: JwtHelper = new JwtHelper();
  public token: string;
  public currentUser: any;
  public isAdmin: boolean;

  constructor(private http: Http) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(username: string, password: string): Observable<boolean> {
    let headers = new Headers({'Content-type':'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/api/signin', JSON.stringify({username: username, password: password}))
      .map((response: Response) => {
        // login successful if there is a jwt token in the response
        let token = response.json() && response.json().token;
        if(token) {
          //set token property
          this.token = token;

          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));
          this.checkAuthenticationStatus();
          //return true to indicate successful login
          return true;
        } else {
          return false;
        }
      });
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  logout(): void {
    // clear token to remove user from local storage to log out
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  checkAuthenticationStatus() {
    let jwtToken = localStorage.getItem('currentUser');
    if(jwtToken) {
      this.currentUser = this.jwtHelper.decodeToken(jwtToken);
      this.isAdmin = this.currentUser.roles.indexOf('admin') > -1;
    }
  }

}

import { Injectable } from '@angular/core';
import {Http, RequestOptions, Response, Headers} from '@angular/http';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs/Observable';
import {User} from '../_models/user';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  // getUsers(): Observable<User[]> {
  //
  //   return this.http.get('/api/users', options)
  //     .map((response: Response) => response.json());
  // }

  getAll() {
    return this.http.get('/api/users').map((response: Response) => response.json());
  }

  getById(_id: string) {
    return this.http.get('/users/' + _id).map((response: Response) => response.json());
  }

  create(user: User) {
    return this.http.post('/users/register', user);
  }

  update(user: User) {
    return this.http.put('/users/' + user._id, user);
  }

  delete(_id: string) {
    return this.http.delete('/users/' + _id);
  }

}

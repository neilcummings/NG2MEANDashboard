import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'cr-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isIn = false;
  loading = false;
  error = '';

  toggleState() {
    this.isIn = !this.isIn
  }

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
  }

  login(formvalues) {
    console.log(formvalues);
    this.auth.login(formvalues.username, formvalues.password)
      .subscribe(result => {
        if(result === true) {
          // login successful
          console.log('login success');
        } else {
          // login failed
          console.log('login failed');
        }
      });
  }

  logout() {
    this.auth.logout();
  }

}

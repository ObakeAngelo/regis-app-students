import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {}

  login() {
    console.log('email: ', this.email);
    console.log('password', this.password);
    this.authService.login(this.email, this.password);
  }
}

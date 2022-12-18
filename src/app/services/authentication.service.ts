import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'token';

  constructor(
    private usersService: UsersService,
    private router: Router,
    private toastController: ToastController
  ) {}

  public login(username: string, password: string): void {
    this.usersService.getUser(username, password).subscribe((Users) => {
      if (Users.length > 0 && Users[0].rol === 'alumno') {
        console.log('User: ', Users[0]);
        localStorage.setItem(this.tokenKey, Users[0].token);
        localStorage.setItem('student', JSON.stringify(Users[0]));
        this.router.navigate(['/home']);
      } else {
        this.presentToast('Usuario o contraseña incorrectos');
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  public logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('student');
    this.router.navigate(['/login']);
  }

  public getTeacherId(): number {
    return parseInt(localStorage.getItem('teacher-id') || '0');
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(this.tokenKey);
    console.log('token: ', token);
    return token != null && token.length > 0;
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null;
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DataService, Student } from '../services/data.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  lessonCode: string = '';

  constructor(
    private authService: AuthenticationService,
    private dataService: DataService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  scan() {
    console.log('scan');
    console.log('lessonCode: ', this.lessonCode);

    const studentId = this.dataService.getStudentIdFromLocalstorage();
    const studentName = this.dataService.getStudentNameFromLocalstorage();
    console.log('studentId: ', studentId);

    this.dataService
      .getStudentByIdAndLessonId(studentId, Number(this.lessonCode))
      .subscribe((student) => {
        if (student && student.length > 0) {
          this.presentToast('usuario ya registro asistencia');
        } else {
          const lessonUser = {
            student: studentId,
            lesson: Number(this.lessonCode),
            name: studentName,
            date: new Date().toLocaleString(),
          } as Student;

          this.dataService.postLessonUser(lessonUser).subscribe((_res) => {
            this.presentToast('asistencia registrada');
          });
        }
      });
  }

  logout() {
    this.authService.logout();
  }
}

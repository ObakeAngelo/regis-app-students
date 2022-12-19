import { Component, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DataService, Student } from '../services/data.service';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnDestroy {
  lessonCode: string = '';
  scannedOutput: any;

  constructor(
    private authService: AuthenticationService,
    private dataService: DataService,
    private toastController: ToastController
  ) {}

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  async checkPermission() {
    // check or request permission
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      // the user granted permission
      return true;
    }

    return false;
  }

  postClass(idClass: number) {
    const studentId = this.dataService.getStudentIdFromLocalstorage();
    const studentName = this.dataService.getStudentNameFromLocalstorage();

    this.dataService
      .getStudentByIdAndLessonId(studentId, idClass)
      .subscribe((student) => {
        if (student && student.length > 0) {
          this.presentToast('usuario ya registro asistencia');
        } else {
          const lessonUser = {
            student: studentId,
            lesson: idClass,
            name: studentName,
            date: new Date().toLocaleString(),
          } as Student;

          console.log('lessonUser', lessonUser);

          this.dataService.postLessonUser(lessonUser).subscribe((_res) => {
            this.presentToast('asistencia registrada');
          });
        }
      });
  }

  logout() {
    this.authService.logout();
  }

  async startScanning() {
    try {
      const permission = this.checkPermission();
      if (!permission) {
        return;
      }

      await BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        this.scannedOutput = result.content;

        BarcodeScanner.showBackground();
        document.querySelector('body')?.classList.remove('scanner-active');
        this.postClass(Number(this.scannedOutput));
      }
    } catch (error) {
      console.log(error);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
  }

  ngOnDestroy() {
    this.stopScan();
  }
}

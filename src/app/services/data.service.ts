import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Lesson {
  id?: number;
  name: string;
  description: string;
  teacher: number;
  date: string;
  students?: number[];
}

export interface Student {
  id?: number;
  name: string;
  lesson: number;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  public getLessonsByTeacher(teacherId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(
      environment.apiurl + '/lessons?teacher=' + teacherId
    );
  }

  public postLesson(lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(environment.apiurl + '/lessons', lesson);
  }

  public getLessonById(lessonId: number): Observable<Lesson> {
    return this.http.get<Lesson>(environment.apiurl + '/lessons/' + lessonId);
  }

  public getStudentIdFromLocalstorage(): number {
    const student = JSON.parse(
      localStorage.getItem('student') || '{}'
    ) as Student;
    return student.id || 0;
  }

  public getStudentNameFromLocalstorage(): string {
    const student = JSON.parse(
      localStorage.getItem('student') || '{}'
    ) as Student;
    return student.name;
  }

  public getStudentByIdAndLessonId(
    studentId: number,
    lessonId: number
  ): Observable<Student[]> {
    return this.http.get<Student[]>(
      environment.apiurl +
        '/lesson_users?student=' +
        studentId +
        '&lesson=' +
        lessonId
    );
  }

  public postLessonUser(lessonUser: Student): Observable<Student> {
    return this.http.post<Student>(
      environment.apiurl + '/lesson_users',
      lessonUser
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/api-models/student.model';
import { UpdateStudentRequest } from '../models/api-models/update-student-request.model';
import { AddStudentRequest } from '../models/api-models/ui-models/add-student-request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {


  private baseApiUrl =environment.baseApiUrl;
  constructor(private httpClient: HttpClient) { }

  getStudents(): Observable<Student[]> {

   return this.httpClient.get<Student[]>(this.baseApiUrl +'/students')

  }

  getStudent(studentId: string): Observable<Student> {
     return this.httpClient.get<Student>(this.baseApiUrl+'/Students/Students/' + studentId)
  }

  updateStudent(studentId: string, studentRequest:Student): Observable<Student>{
    const updateStudentRequest: UpdateStudentRequest = {

      firstName:studentRequest.firstName,
      lastName:studentRequest.lastName,
      dateOfBirth:studentRequest.dateOfBirth,
      email:studentRequest.email,
      mobile:studentRequest.mobile,
      genderId:studentRequest.genderId,
      physicalAddress: studentRequest.address.physicalAddress,
      postalAddress: studentRequest.address.postalAddress

    }
     return this.httpClient.put<Student>(this.baseApiUrl+ '/Students/Students/' + studentId,updateStudentRequest );
  }

  deleteStudent(studentId: string): Observable<Student>{
   return this.httpClient.delete<Student>(this.baseApiUrl + '/Students/Students/' + studentId);
   }

   addStudent(studentRequest:Student): Observable<Student>{
    const addStudentRequest: AddStudentRequest = {

      firstName:studentRequest.firstName,
      lastName:studentRequest.lastName,
      dateOfBirth:studentRequest.dateOfBirth,
      email:studentRequest.email,
      mobile:studentRequest.mobile,
      genderId:studentRequest.genderId,
      physicalAddress: studentRequest.address.physicalAddress,
      postalAddress: studentRequest.address.postalAddress

    };
      return this.httpClient.post<Student>(this.baseApiUrl + '/Students/Students/Add',addStudentRequest);
   }

   getImagePath(relativePath:string){
    var fileName=relativePath.substring(relativePath.lastIndexOf('s')+2);

    return `${this.baseApiUrl}/Resources/Images/${fileName}`;

   }

   uploadImage(studentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append("profileImage", file);

    const url = `${this.baseApiUrl}/Students/Students/${studentId}/upload-image`;

    return this.httpClient.post(url, formData, { responseType: 'text' });
  }



}

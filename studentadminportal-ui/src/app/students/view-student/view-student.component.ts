import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/api-models/student.model';
import { Gender } from 'src/app/models/api-models/ui-models/gender.model';
import { GenderService } from 'src/app/services/gender.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css'],
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;

  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    profileImageUrl: '',
    genderId: '',
    gender: {
      id: '',
      description: '',
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
    },
  };

  isNewStudent = false;
  header = '';

  displayProfileImageUrl = '';

  genderList: Gender[] = [];

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

  constructor(
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');

      if (this.studentId) {
        if (this.studentId.toLowerCase() === 'Add'.toLowerCase()) {
          //New Student Functionality
          this.isNewStudent = true;
          this.header = 'Add New Student';
          this.setImage();
        } else {
          //Existing student functionality
          this.isNewStudent = false;
          this.header = 'Edit Student';
          this.studentService
            .getStudent(this.studentId)

            .subscribe(
              (successResponse) => {
                this.student = successResponse;
                this.setImage();
                console.log(successResponse);
              },
              (errorResponse) => {
                this.setImage();
              }
            );
        }

        this.genderService.getGenderList().subscribe((successResponse) => {
          this.genderList = successResponse;
        });
      }
    });
  }

  onUpdate(): void {
    //Check If Form is valid
    if (this.studentDetailsForm?.form.valid) {
      //Call Student service to Update
      this.studentService
        .updateStudent(this.student.id, this.student)
        .subscribe(
          (successResponse) => {
            this.snackbar.open('Student updated successfully', undefined, {
              duration: 3000,
            });

            // Show notification
          },
          (errorResponse) => {
            // log it
          }
        );
    }
  }

  onDelete(): void {
    //call the student service to delete the student
    this.studentService.deleteStudent(this.student.id).subscribe(
      (successResponse) => {
        this.snackbar.open('Student deleted successfully', undefined, {
          duration: 2000,
        });

        setTimeout(() => {
          this.router.navigateByUrl('students');
        }, 3000);
      },
      (errorResponse) => {
        //log
      }
    );
  }

  onAdd(): void {
    //Check if form is valid
    if (this.studentDetailsForm?.form.valid) {
      //Submit form data to API
      this.studentService.addStudent(this.student).subscribe(
        (successResponse) => {
          this.snackbar.open('Student added successfully', undefined, {
            duration: 2000,
          });

          setTimeout(() => {
            this.router.navigateByUrl(`students/${successResponse.id}`);
          }, 3000);
        },
        (errorResponse) => {
          //log the error response
          console.log(errorResponse);
        }
      );
    }
  }

  uploadImage(event: any): void {
    if (this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file).subscribe(
        (successResponse) => {
          this.student.profileImageUrl = successResponse;
          this.setImage();
          console.log(successResponse);

          //show a notification using snackbar
          this.snackbar.open('Profile Image Updated successfully', undefined, {
            duration: 3000,
          });
        },
        (errorResponse) => {}
      );
    }
  }

  private setImage(): void {
    if (this.student.profileImageUrl) {
      if (
        this.student.profileImageUrl == 'imageurl' ||
        this.student.profileImageUrl == 'null'
      ) {
        //display default
        this.displayProfileImageUrl = 'assets/user.jpg';
      } else {
        //fetch image by url
        this.displayProfileImageUrl = this.studentService.getImagePath(
          this.student.profileImageUrl
        );
        console.log(this.displayProfileImageUrl);
      }
    } else {
      this.displayProfileImageUrl = 'assets/userImage.png';
    }
  }
}

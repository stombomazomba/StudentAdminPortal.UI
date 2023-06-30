import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from './student.service';
import { Student } from '../models/api-models/student.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})

export class StudentsComponent implements OnInit {
  
  //Properties
  students: Student[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email','mobile','gender', 'edit'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();
  //View Type property for the paginator
   @ViewChild(MatPaginator) matPaginator!: MatPaginator;
   @ViewChild(MatSort) matSort!: MatSort;
    filterString ='';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    //Fetching the students
    this.studentService.getStudents().subscribe(
      (successResponse) => {
        //Assigning students coming back from the API
        this.students = successResponse;
        //Assigning Data Source
        this.dataSource = new MatTableDataSource<Student>(this.students);

          //Assigning Data Source for the Paginator
          if (this.matPaginator){
            this.dataSource.paginator = this.matPaginator;
          }
          if (this.matSort){
            this.dataSource.sort =this.matSort;
          }
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
  }

  filterStudents(){
    this.dataSource.filter = this.filterString.trim().toLowerCase();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StudentModel } from './studentdashboard.model';
import { StudentApiService } from '../services/student-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-studentdashboard',
  templateUrl: './studentdashboard.component.html',
  styleUrls: ['./studentdashboard.component.css']
})
export class StudentdashboardComponent implements OnInit {
  firstAndLastNamesPattern = "^[\a-zA-Z'\-,.]*[^_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\/]]*$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  mobilePattern = "^((\\+91-?)|0)?[0-9]{10}$";
  feesPattern = "^((\\+91-?)|0)?[0-9]{5}$";
  tutorials: any = ['Hacking', 'FullStack Developer', 'Database Adminstrator'];
  studentForm!: FormGroup;
  studentModelObject : StudentModel = new StudentModel();
  allStudents: any;
  showAddOrganization !: boolean;
  showUpdateOrganization !: boolean;
  submitted:boolean = false;
  constructor(private formBuilder: FormBuilder, private studentApi: StudentApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
     this.studentForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(this.firstAndLastNamesPattern)]],
      lastName: ['', [Validators.required, Validators.pattern(this.firstAndLastNamesPattern)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(this.mobilePattern)]],
      fees: ['', [Validators.required, Validators.pattern(this.feesPattern)]],
      tutorial: ['', Validators.required],
    })
    this.getAllStudents();
  }

  get validationForm() { return this.studentForm.controls; }

  selectTutorial(event: any): void{
    this.studentForm.patchValue({
      preferredTutorial: event.target.value
    });
  }

  postStudentDetails(){
    this.submitted = true;
    if(this.studentForm.invalid)
    {
      this.toastr.error("Kindly double-check your details!");
    }
    else
    {
      this.studentModelObject.firstName = this.studentForm.value.firstName;
      this.studentModelObject.lastName = this.studentForm.value.lastName;
      this.studentModelObject.email = this.studentForm.value.email;
      this.studentModelObject.mobileNumber = this.studentForm.value.mobileNumber;
      this.studentModelObject.fees = this.studentForm.value.fees;
      this.studentModelObject.tutorial = this.studentForm.value.tutorial;//check here intensively

      this.studentApi.onPost(this.studentModelObject).subscribe(res=>{
        console.log(res);
        this.toastr.success("Added successfully!");
        let ref = document.getElementById('cancel');
        ref?.click();
        this.studentForm.reset();
        this.getAllStudents();
      },
      err=>{
        this.toastr.error("Error!");
      })
    }
  }

  getAllStudents(){
    this.studentApi.onGet().subscribe(res=>{
      this.allStudents = res;
    })
  }

  deleteStudent(data:any){
    this.studentApi.onDelete(data.id).subscribe(res=>{
     this.toastr.error("Deleted successfully!");
      this.getAllStudents();
    },
    err=>{
      this.toastr.error("Error!");
    })
  }

  onEdit(data:any){
    this.showAddOrganization = false;
    this.showUpdateOrganization = true;
    this.studentModelObject.studentId = data.id;
    this.studentForm.controls['firstName'].setValue(data.firstName);
    this.studentForm.controls['lastName'].setValue(data.lastName);
    this.studentForm.controls['email'].setValue(data.email);
    this.studentForm.controls['mobileNumber'].setValue(data.mobileNumber);
    this.studentForm.controls['fees'].setValue(data.fees);
    this.studentForm.controls['tutorial'].setValue(data.tutorial);
  }
  updateStudent(){
    this.submitted = true;
    if(this.studentForm.invalid)
    {
      this.toastr.error("Kindly double-check your details!");
    }
    else
    {
      this.studentModelObject.firstName = this.studentForm.value.firstName;
      this.studentModelObject.lastName = this.studentForm.value.lastName;
      this.studentModelObject.email = this.studentForm.value.email;
      this.studentModelObject.mobileNumber = this.studentForm.value.mobileNumber;
      this.studentModelObject.fees = this.studentForm.value.fees;
      this.studentModelObject.tutorial = this.studentForm.value.tutorial;
      this.studentApi.onUpdate(this.studentModelObject, this.studentModelObject.studentId).subscribe(res=>{
        this.toastr.info('Updated successfully!');
        let ref = document.getElementById('cancel');
        ref?.click();
        this.studentForm.reset();
        this.getAllStudents();
      },
      err=>{
       this.toastr.error("Error!");
      })
    }
  }

  onAddStudent(){
    this.studentForm.reset();
    this.showAddOrganization = true;
    this.showUpdateOrganization = false;
  }
}

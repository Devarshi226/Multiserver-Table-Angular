import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder,  Validators  } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  Form!: FormGroup;


 constructor(private formbuilder:FormBuilder, 
  private dialog:MatDialogRef<FormComponent>, 
  @Inject(MAT_DIALOG_DATA)public data:any){
  // this.Form = this.formbuilder.group({
  //   name: ['', Validators.required],
  //     email: ['', [Validators.required, Validators.email]],
  //     phone: ['', Validators.required],
  //     country: ['', Validators.required],
  //     gender: ['', Validators.required]
  // })
 }

 

}

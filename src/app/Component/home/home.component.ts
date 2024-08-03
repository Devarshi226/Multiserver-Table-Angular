import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableService } from 'src/app/Services/table.service';
import { MatDialog } from '@angular/material/dialog';

import { Route, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name','email','phone','country', 'gender', 'action' ];
  dataSource : MatTableDataSource<any>;
  tableData: any;
  userForm : FormGroup;
  userdata: any;
  tempData: any;
  savedata:boolean = false
  premiumData : any[] = [];
  paginateData: any[] = [];
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  selectedUser: any;
  isSavePending: boolean = false;
  rowsMarkedForDeletion: any[] = [];
  dataId : any;
  deleteUser : boolean = false;
  editUser : boolean = false;
  
  
  countries = [
    // { name: 'Select a country', code: '' },
    {id: 1, name: 'USA', code: '+1' },
    {id: 2, name: 'Canada', code: '+1' },
    {id: 3, name: 'UK', code: '+44' },
    {id: 4, name: 'Australia', code: '+61' },
    {id: 5, name: 'India', code: '+91' }
  ];

  states:  { [key: number]: { id: number, name: string }[] } = {
    1: [
      {id: 1, name: 'New York'},
      {id: 2, name: 'California'}
    ],
    2: [
      {id: 3, name: 'Ontario'},
      {id: 4, name: 'British Columbia'}
    ]
  };

  cities: { [key: number]: { id: number, name: string }[] } = {
    1: [
      {id: 1, name: 'New York City'},
      {id: 2, name: 'Los Angeles'}
    ],
    2: [
      {id: 3, name: 'Toronto'},
      {id: 4, name: 'Vancouver'}
    ]
  }
  
  selectedCountryId: number = 0;
  selectedStateId: number = 0 ;
  selectedCityId: number = 0;

  onCountryChanges(){
    this.selectedStateId = 0;
    this.selectedCityId = 0;
  }
  onStateChange(){
    this.selectedCityId = 0;
  }



  constructor(private service:TableService, private fb:FormBuilder){
    this.dataSource = new MatTableDataSource<any>(this.tableData);
    this.userForm = this.fb.group ({
      name: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
      email: new FormControl('',[Validators.required,Validators.pattern('^([0-9a-zA-Z]([-\\.\\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$')]),
      phone: new FormControl('',[Validators.required, Validators.pattern(/^(\+?\d{1,4}\s?)?\d{10}$/)]),
      country: ['', [Validators.required]],
      state: ['',[Validators.required]],
      city: ['',[Validators.required]],
      gender: ['', [Validators.required]]
    })
  }
  ngOnInit(): void {
   this.getUserList();
  //  this.userForm.get('country')?.valueChanges.subscribe(value => {
  //   const countryCodeControl = this.userForm.get('phone');
  //   if (countryCodeControl) {
  //     const selectedCountry = this.countries.find(c => c.name === value);
  //     if (selectedCountry) {
  //       countryCodeControl.setValue(selectedCountry.code);
  //     }
  //   }
  // });
  this.getUserList();
  this.userForm.get('country')?.valueChanges.subscribe(value => {
    const selectedCountry = this.countries.find(c => c.name === value);
    if (selectedCountry) {
      this.userForm.get('phone')?.setValue(selectedCountry.code + this.userForm.get('phone')?.value.slice(selectedCountry.code.length));
    }
  });
  }
  
  getUserList() {
    // return this.service.getUser().subscribe((res:any)=>{
    //     this.dataSource = new MatTableDataSource(res);   
    // })
    this.service.getUser().subscribe((res: any) => {
      this.premiumData = res;
      this.collectionSize = this.premiumData.length;
      this.getPremiumData();
    });
  }
 
  get f(){
    return this.userForm.controls;
  }

  getCountryCode(): string {
    const selectedCountry = this.userForm.get('country')?.value;
    const country = this.countries.find(c => c.name === selectedCountry);
    return country ? country.code : '';
  }

  onCountryChange(event: Event) {
    const selectedCountry = (event.target as HTMLSelectElement).value;
    const country = this.countries.find(c => c.name === selectedCountry);
    if (country) {
      const countryCodeControl = this.userForm.get('phone');
      if (countryCodeControl) {
        countryCodeControl.setValue(country.code);
      }
    }
  }

  onEdit(row: any) {
    this.editUser = true;
    this.selectedUser = row;
    this.userForm.patchValue({
      name: row.name,
      email: row.email,
      country: row.country,
      phone: row.phone,
      gender: row.gender
    });
    const modalElement = document.getElementById('myone');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
 
//  addItem(){
//     this.savedata = true
//     this.userdata = this.userForm.value
//     this.isSavePending = true;
//     this.service.addUser(this.userdata).subscribe(()=>{})
//     this.tempData = this.userdata;
  
//       this.userForm.reset(); 
//       this.getUserList();
     
//     }

addItem() {
  this.savedata = true;
  this.userdata = this.userForm.value;
  this.isSavePending = true;
  
  if (this.selectedUser) {
    // Update existing user
    this.editUser = true
    this.isSavePending = true
  }
  else{
    this.savedata = true
    this.isSavePending = true;
  }
}



  
    reset() {
      this.userForm.reset(); 
      this.selectedUser = null;
    }
      
   getPremiumData(){
    this.paginateData = this.premiumData.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.dataSource = new MatTableDataSource(this.paginateData); 
   }

   

   Save(){
    if(this.savedata){ 
      this.service.addUser(this.userdata).subscribe(
        () => {
          
          console.log("database1 save successfully");
        },
        (err) => {
          console.error('Error adding user:', err);
        }
      );
      this.service.addData(this.userdata).subscribe(()=>{

        console.log("database2 save successfully");
      }, (err) => {
        console.error('Error adding user:', err);
      });
      this.userForm.reset();
      this.getUserList();
      this.savedata = false
      this.isSavePending = false;
    }
    if(this.deleteUser){
      this.service.deleteUser(this.dataId).subscribe(
        (res) => {
          console.log('User deleted database1 successfully');
          // this.getUserList(); // Refresh the user list after deletion
        },
        (err) => {
          console.error('Error deleting user:', err);
        }
      );
      this.service.deleteUser1(this.dataId).subscribe(
        (res) => {
          console.log('User deleted database2 successfully');
          this.getUserList(); 
        },
        (err) => {
          console.error('Error deleting user:', err);
        }
      );
      this.isSavePending = false;
      this.deleteUser = false;
    }
    if(this.editUser){
      this.service.updateUser(this.selectedUser.id, this.userdata).subscribe(
        () => {
          console.log('User database1 updated successfully');
        },
        (err) => {
          console.error('Error updating user:', err);
        }
      );
      this.service.updateUser1(this.selectedUser.id, this.userdata).subscribe( ()=>{
        console.log('User database2 update successfully');
        this.getUserList(); // Refresh the user list after update
        this.reset();
      },(err) => {
        console.error('Error updating user:', err);
      })

      this.editUser = false;
      this.isSavePending = false;
    }
   }
   

   onDelete(id: any) {
    this.deleteUser = true;

    this.dataId = id;
    this.isSavePending = true;
    

  }

}

  



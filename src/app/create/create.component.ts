import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit{
  pageSize: number = 10;
    pageIndex: number = 0;
    currentUserList: any[] = [];
    totalUserList: any[] = [];
    userForm: FormGroup;
    isEditing: any = null;
    searchedText: string = '';

    constructor(private fb: FormBuilder, private userService: UserService, private http: HttpClient) {
        this.userForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            last_name: [''],
            email: ['', [Validators.required, Validators.email]],
            country: [''],
            company_name: [''],
            role: ['']
        });
    }
    

    ngOnInit(): void {
        this.displayUsers();
    }

    displayUsers() {
        this.userService.getUserList().subscribe(users => {
            this.totalUserList = users;
            this.updatecurrentUserList();
        });
    }

    updatecurrentUserList() {
        this.currentUserList = this.totalUserList?.filter(user => user?.name?.includes(this.searchedText) || user?.email?.includes(this.searchedText))
            .slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
    }

    addNewUser() {
        if (this.userForm.valid) {
            this.userService.addNewUser(this.userForm.value).subscribe(user => {
                this.totalUserList.push(user);
                this.userForm.reset();
                this.updatecurrentUserList();
                
            });
        }
    }

    

    updateUser() {
        if (this.userForm.valid) {
            this.userService.updateUser(this.isEditing.id, this.userForm.value).subscribe(updatedUser => {
                const index = this.totalUserList.findIndex(user => user.id === this.isEditing.id);
                this.totalUserList[index] = updatedUser;
                this.isEditing = null;
                this.userForm.reset();
                this.updatecurrentUserList();
            });
        }
    }

   
}



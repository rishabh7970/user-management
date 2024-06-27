
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { PageEvent } from '@angular/material/paginator';
import { UserService } from '../user.service';


@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

    pageSize: number = 10;
    pageIndex: number = 0;
    currentUserList: any[] = [];
    totalUserList: any[] = [];
    userForm: FormGroup;
    isEditing: any = null;
    searchedText: string = '';

    constructor(private fb: FormBuilder, private userService: UserService) {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required]
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

    editingUser(user: any) {
        this.isEditing = user;
        this.userForm.setValue({
            name: user.name,
            email: user.email,
            role: user.role
        });
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

    deleteUser(userId: number) {
        this.userService.deleteUser(userId).subscribe(() => {
            this.totalUserList = this.totalUserList.filter(user => user.id !== userId);
            this.updatecurrentUserList();
        });
    }

    onSearch(event: any) {
        this.searchedText = event.target.value;
        this.updatecurrentUserList();
    }

    // onPageChange(event: PageEvent) {
    //     this.pageSize = event.pageSize;
    //     this.pageIndex = event.pageIndex;
    //     this.updatecurrentUserList();
    // }
}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;

  viewAll: boolean = false;
  currentUserList: any[] = [];
  totalUserList: any[] = [];
  userForm: FormGroup;
  isEditing: any = null;
  searchedText: string = '';
  loading: boolean = false;
  selectedProfile: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      country: [''],
      company_name: [''],
      role: [''],
      profile: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.displayUsers();
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.loading) {
        this.loadMoreUsers();
      }
    }, {
      root: null,
      threshold: 0.1
    });

    observer.observe(this.scrollAnchor.nativeElement);
  }

  displayUsers() {
    this.userService.getUserList().subscribe(users => {
      this.totalUserList = users;
      this.updateCurrentUserList();
    });
  }

  updateCurrentUserList() {
    if (this.selectedProfile) {
      this.currentUserList = this.totalUserList
        .filter(user => user.profile === this.selectedProfile && (user?.name?.includes(this.searchedText) || user?.email?.includes(this.searchedText)))
        .sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.viewAll) {
      this.currentUserList = this.totalUserList
        .filter(user => user?.name?.includes(this.searchedText) || user?.email?.includes(this.searchedText))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  loadMoreUsers() {
    this.loading = true;
    setTimeout(() => {
      const nextUsers = this.totalUserList.slice(this.currentUserList.length, this.currentUserList.length + 10);
      this.currentUserList = [...this.currentUserList, ...nextUsers].sort((a, b) => a.name.localeCompare(b.name));
      this.loading = false;
    }, 1000);
  }

  startEditing(user: any) {
    this.isEditing = user;
  }

  updateUser(user: any) {
    if (user) {
      this.userService.updateUser(user.id, user).subscribe(updatedUser => {
        const index = this.totalUserList.findIndex(u => u.id === updatedUser.id);
        this.totalUserList[index] = updatedUser;
        this.updateCurrentUserList();
        this.isEditing = null;
      });
    }
  }

  deleteUser(userId: any) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.totalUserList = this.totalUserList.filter(user => user.id !== userId);
      this.updateCurrentUserList();
    });
  }

  onSearch(event: any) {
    this.searchedText = event.target.value;
    this.updateCurrentUserList();
  }

  selectProfile(profile: string) {
    this.selectedProfile = profile;
    this.viewAll = false;
    this.updateCurrentUserList();
  }

  viewAllUsers() {
    this.selectedProfile = null;
    this.viewAll = true;
    this.updateCurrentUserList();
  }
}

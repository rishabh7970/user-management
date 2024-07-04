import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;

  currentUserList: any[] = [];
  totalUserList: any[] = [];
  Users1: any[] = [];
  Users2: any[] = [];
  userForm: FormGroup;
  isEditing: any = null;
  searchedText: string = '';
  loading: boolean = false;
  showProfilesFlag: boolean = false;
  currentProfile: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      company_name: ['', Validators.required],
      role: ['', Validators.required]
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
      this.Users1 = users.filter(user => user.profile === 'Profile1');
      this.Users2 = users.filter(user => user.profile === 'Profile2');
      this.updateCurrentUserList();
    });
  }

  updateCurrentUserList() {
    if (this.currentProfile === 'Profile1') {
      this.currentUserList = this.Users1;
    } else if (this.currentProfile === 'Profile2') {
      this.currentUserList = this.Users2;
    }
  }

  loadMoreUsers() {
    this.loading = true;
    setTimeout(() => {
      const nextUsers = this.totalUserList.slice(this.currentUserList.length, this.currentUserList.length + 10);
      this.currentUserList = [...this.currentUserList, ...nextUsers];
      this.loading = false;
    }, 1000);
  }

  startEditing(user: any) {
    this.isEditing = user;
  }

  goBackToHome() {
    this.showProfilesFlag = false;
    this.currentProfile = '';
    // Optional: Navigate to the home route, if needed
    // this.router.navigate(['/home']);
  }

  updateUser(user: any) {
    if (user) {
      this.userService.updateUser(user.id, user).subscribe(updatedUser => {
        const index = this.totalUserList.findIndex(u => u.id === updatedUser.id);
        this.totalUserList[index] = updatedUser;
        this.Users1 = this.totalUserList.filter(user => user.profile === 'Profile1');
        this.Users2 = this.totalUserList.filter(user => user.profile === 'Profile2');
        this.updateCurrentUserList();
        this.isEditing = null; 
      });
    }
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.totalUserList = this.totalUserList.filter(user => user.id !== userId);
      this.Users1 = this.totalUserList.filter(user => user.profile === 'Profile1');
      this.Users2 = this.totalUserList.filter(user => user.profile === 'Profile2');
      this.updateCurrentUserList();
    });
  }

  onSearch(event: any) {
    this.searchedText = event.target.value;
    this.updateCurrentUserList();
  }

  showProfiles() {
    this.showProfilesFlag = true;
  }

  showHome() {
    this.showProfilesFlag = false;
  }

  showProfileUsers(profile: string) {
    this.currentProfile = profile;
    this.showProfilesFlag = false;
    this.updateCurrentUserList();
  }
}

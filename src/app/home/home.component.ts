import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../AppServices/profile.service';

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
  profileForm: FormGroup;
  isEditing: any = null;
  searchedText: string = '';
  loading: boolean = false;
  showProfilesFlag: boolean = false;
  currentProfile: string = '';
  profiles: any[] = [];
  isCreatingProfile: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      company_name: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.profileForm = this.fb.group({
      profileName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['viewProfiles']) {
        this.showProfilesFlag = true;
        this.isCreatingProfile = false;
      } else if (params['createNewProfile']) {
        this.isCreatingProfile = true;
        this.showProfilesFlag = false;
      } else if (params['profile']) {
        this.currentProfile = params['profile'];
        this.showProfilesFlag = false;
        this.isCreatingProfile = false;
        this.updateCurrentUserList();
      } else {
        this.showProfilesFlag = false;
        this.isCreatingProfile = false;
      }
    });

    this.profileService.getProfiles().subscribe(profiles => {
      this.profiles = profiles;
      this.displayUsers();
    });
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver !== 'undefined' && this.scrollAnchor) {
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
    } else {
      this.currentUserList = [];
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
    this.isCreatingProfile = false;
    this.router.navigate(['/']);
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

  deleteProfile(profileName: string) {
    if (confirm(`Are you sure you want to delete the profile "${profileName}"?`)) {
      this.profileService.deleteProfile(profileName).subscribe(() => {
        this.profiles = this.profiles.filter(profile => profile.name !== profileName);
        this.userService.getUserList().subscribe(users => {
          this.totalUserList = users.filter(user => user.profile !== profileName);
          this.Users1 = this.totalUserList.filter(user => user.profile === 'Profile1');
          this.Users2 = this.totalUserList.filter(user => user.profile === 'Profile2');
          this.updateCurrentUserList();
        });
      });
    }
  }

  onSearch(event: any) {
    this.searchedText = event.target.value;
    this.updateCurrentUserList();
  }

  showProfiles() {
    this.router.navigate(['/'], { queryParams: { viewProfiles: true } });
  }

  showHome() {
    this.router.navigate(['/']);
  }

  showProfileUsers(profile: string) {
    this.currentProfile = profile;
    this.router.navigate(['/view'], { queryParams: { profile: profile } });
  }

  startCreatingProfile() {
    this.router.navigate(['/'], { queryParams: { createNewProfile: true } });
  }

  cancelCreatingProfile() {
    this.router.navigate(['/'], { queryParams: { viewProfiles: true } });
  }

  createProfile() {
    if (this.profileForm.valid) {
      const profileName = this.profileForm.value.profileName;
      if (profileName && !this.profiles.some(profile => profile.name === profileName)) {
        this.profileService.addProfile(profileName).subscribe(() => {
          this.profileService.getProfiles().subscribe(profiles => {
            this.profiles = profiles;
            this.router.navigate(['/'], { queryParams: { viewProfiles: true } });
          });
        });
      }
    }
  }

  viewProfile(profileName: string) {
    this.router.navigate(['/view'], { queryParams: { profile: profileName } });
  }

  createUser(profileName: string) {
    this.router.navigate(['/create'], { queryParams: { profile: profileName } });
  }
}

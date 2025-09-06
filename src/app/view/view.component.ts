import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../AppServices/profile.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;

  currentUserList: any[] = [];
  totalUserList: any[] = [];
  userForm: FormGroup;
  isEditing: any = null;
  searchedText: string = '';
  loading: boolean = false;
  selectedProfile: string | null = null;
  dropdownVisible: boolean = false;
  profiles: string[] = [];
  sortOrder: 'asc' | 'desc' = 'asc'; // Default sort order

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute
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
    this.loadProfiles();
    this.route.queryParams.subscribe(params => {
      if (params['profile']) {
        this.selectedProfile = params['profile'];
      }
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
      if (this.selectedProfile) {
        this.totalUserList = users.filter(user => user.profile === this.selectedProfile);
      } else {
        this.totalUserList = users;
      }
      this.updateCurrentUserList();
    });
  }

  loadProfiles() {
    this.profileService.getProfiles().subscribe(profiles => {
      this.profiles = profiles.map(profile => profile.name);
    });
  }

  updateCurrentUserList() {
    let filteredUsers = this.totalUserList.filter(user =>
      (user.name?.includes(this.searchedText) || user.email?.includes(this.searchedText))
    );

    // Sort the filtered list based on the selected sort order
    this.currentUserList = filteredUsers.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  loadMoreUsers() {
    if (this.loading) return;

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
    this.dropdownVisible = false;
    this.displayUsers();
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  getDropdownClass(profile: string): string {
    return this.selectedProfile === profile ? 'dropdown-item active' : 'dropdown-item';
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.updateCurrentUserList();
  }
}

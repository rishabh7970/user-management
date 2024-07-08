import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ProfileService } from '../AppServices/profile.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  userForm: FormGroup;
  isEditing: boolean = false;
  showThankYou: boolean = false;
  showErrorPage: boolean = false;
  errorMessages: string[] = [];
  profiles: string[] = [];
  defaultProfile: string = '';

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
      this.defaultProfile = params['profile'] || '';
      if (this.defaultProfile) {
        this.userForm.patchValue({ profile: this.defaultProfile });
      }
    });
  }

  loadProfiles() {
    this.profileService.getProfiles().subscribe(profiles => {
      this.profiles = profiles.map(profile => profile.name);
    });
  }

  submitForm() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      this.userService.addNewUser(formValue).subscribe(() => {
        this.profileService.getProfiles().subscribe(profiles => {
          if (!profiles.some(profile => profile.name === formValue.profile)) {
            this.profileService.addProfile(formValue.profile).subscribe(() => {
              this.showThankYou = true;
              this.showErrorPage = false;
            });
          } else {
            this.showThankYou = true;
            this.showErrorPage = false;
          }
        });
      });
    } else {
      this.showErrorPage = true;
      this.errorMessages = this.getFormValidationErrors();
    }
  }

  getFormValidationErrors() {
    const errors: string[] = [];
    Object.keys(this.userForm.controls).forEach(key => {
      const controlErrors = this.userForm.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(errorKey => {
          errors.push(`${key} is invalid: ${errorKey}`);
        });
      }
    });
    return errors;
  }

  returnToForm() {
    this.showThankYou = false;
    this.showErrorPage = false;
    this.userForm.reset();
    this.route.queryParams.subscribe(params => {
      this.defaultProfile = params['profile'] || '';
      if (this.defaultProfile) {
        this.userForm.patchValue({ profile: this.defaultProfile });
      }
    });
  }

  goToViewPage() {
    this.router.navigate(['/view']);
  }
}

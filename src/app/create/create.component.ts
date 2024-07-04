import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

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
  profiles: string[] = ['Profile1', 'Profile2'];

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
    // Initialization logic if needed
  }

  submitForm() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      this.userService.getUserList().subscribe(users => {
        const isIdUnique = !users.some(user => user.id === formValue.id);
        if (isIdUnique) {
          this.userService.addNewUser(formValue).subscribe(() => {
            this.showThankYou = true;
            this.showErrorPage = false;
          });
        } else {
          this.userForm.controls['id'].setErrors({ nonUniqueId: true });
        }
      });
    } else {
      this.showErrorPage = true;
      this.errorMessages = this.getFormValidationErrors();
    }
  }

  handleError(error: any) {
    this.showErrorPage = true;
    this.errorMessages = [error.message || 'An error occurred while submitting the form.'];
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
  }

  goToViewPage() {
    this.router.navigate(['/view']); // Adjust the route as needed
  }
}

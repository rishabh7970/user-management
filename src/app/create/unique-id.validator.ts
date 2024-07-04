import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function uniqueIdValidator(existingIds: number[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (existingIds.includes(control.value)) {
      return { nonUniqueId: true };
    }
    return null;
  };
}

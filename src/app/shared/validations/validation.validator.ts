import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

//Validations : Allow Alphanumeric char and space only
export class TextFieldValidator {
  static validTextField(formControl: FormControl) {
    if (
      formControl.value != undefined &&
      formControl.value != '' &&
      formControl.value != null
    ) {
      const regex = /^[0-9a-zA-Z ]+$/;
      if (regex.test(formControl.value)) {
        return null;
      } else {
        return { validTextField: true };
      }
    } else {
      return null;
    }
  }
}

//Validations : Allow Numeric char
export class NumberFieldValidator {
  static validNumberField(formControl: FormControl) {
    if (
      formControl.value != undefined &&
      formControl.value != '' &&
      formControl.value != null
    ) {
      const regex = /[0-9]+/;
      if (regex.test(formControl.value)) {
        return null;
      } else {
        return { validNumberField: true };
      }
    } else {
      return null;
    }
  }
}

//Validations : Allow char and space only
export class CharFieldValidator {
  static validCharField(formControl: FormControl) {
    if (
      formControl.value != undefined &&
      formControl.value != '' &&
      formControl.value != null
    ) {
      const regex = /^[a-zA-Z ]+$/;
      if (regex.test(formControl.value)) {
        return null;
      } else {
        return { validCharField: true };
      }
    } else {
      return null;
    }
  }
}

//Validations : Allow Email only
export class EmailFieldValidator {
  static validEmailField(formControl: FormControl) {
    if (
      formControl.value != undefined &&
      formControl.value != '' &&
      formControl.value != null
    ) {
      const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
      if (regex.test(formControl.value)) {
        return null;
      } else {
        return { validEmailField: true };
      }
    } else {
      return null;
    }
  }
}

//Validations : Not Allowed whitespace only
export class NoWhiteSpaceValidator {
  static noWhiteSpaceValidator(formControl: FormControl) {
    if (
      formControl.value != undefined &&
      formControl.value != '' &&
      formControl.value != null
    ) {
      const isWhiteSpace = formControl.value.toString().trim().length === 0;
      if (!isWhiteSpace) {
        return null;
      } else {
        return { noWhiteSpaceValidator: true };
      }
    } else {
      return null;
    }
  }
}

//Validations: To check two fields to be same value
/* export function MustMatchValidator(field1: string, field2: string) {
  return (formGroup: FormGroup) => {
    const field_1 = formGroup.controls[field1];
    const field_2 = formGroup.controls[field2];

    if (field_2.errors && !field_2.errors['mustMatch']) {
      return;
    }

    if (field_1.value !== field_2.value) {
      field_2.setErrors({ mustMatch: true });
    } else {
      field_2.setErrors(null);
    }
  };
} */

//Validations: To check two fields to be same value
export function MustMatchValidator(
  field1: string,
  field2: string
): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const field_1 = ctrl.get(field1);
    const field_2 = ctrl.get(field2);

    if (field_2.errors && !field_2.errors['mustMatch']) {
      return null;
    }

    if (field_1.value !== field_2.value) {
      field_2.setErrors({ mustMatch: true });
    } else {
      field_2.setErrors(null);
    }
    return null;
  };
}

import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function PriceValidator(price: number): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    let value = 0;
    if (control.value != null) {
      value = Number(control.value.replace(',', '.')) * 100.0;
    }

    if (isNaN(value)) {
      return {priceValidator: true, requiredValue: price};
    }

    if (value > (price * 100.0) || value <= 0.0) {
      return {priceValidator: true, requiredValue: price};
    }
    return null;
  };
}

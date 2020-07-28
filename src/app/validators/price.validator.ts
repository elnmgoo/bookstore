import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function PriceValidator(price: number): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const value: number = parseFloat(control.value) * 100.0;


    if (isNaN(value)) {
      return {priceValidator: true, requiredValue: price};
    }

    if (value > (price * 100)) {
      return {priceValidator: true, requiredValue: price};
    }

    return null;

  };

}

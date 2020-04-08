import { AbstractControl } from '@angular/forms';

export function imgValidation(control: AbstractControl) {
    if(control.value) {
        if (!(control.value.endsWith('png') || control.value.endsWith('jpg') || control.value.endsWith('webp') || control.value.endsWith('svg'))) {
            return { validImg: true};
        }
    }
    return null;
}


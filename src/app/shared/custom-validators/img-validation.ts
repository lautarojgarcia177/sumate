import { AbstractControl } from '@angular/forms';

export function imgValidation(control: AbstractControl) {
    if (!control.value.startsWith('http') && (!control.value.endsWith('jpg') || !control.value.endsWith('png'))) {
        return { validImgUrl: true};
    }
    return null;
}


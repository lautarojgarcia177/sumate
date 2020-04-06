import { AbstractControl } from '@angular/forms';

export function httpsValidation(control: AbstractControl) {
    if (!control.value.startsWith('https')) {
        return { validUrl: true};
    }
    return null;
}


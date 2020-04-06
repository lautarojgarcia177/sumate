import { AbstractControl, ValidatorFn } from '@angular/forms';

export function forbiddenWordsValidation(forbiddenWords: string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const forbidden = forbiddenWords.includes(control.value);
        return forbidden ? {'forbiddenWord': {value: control.value}} : null;
    };
}
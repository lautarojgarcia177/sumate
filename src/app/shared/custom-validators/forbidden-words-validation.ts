import { AbstractControl, ValidatorFn, NG_VALIDATORS, Validator } from '@angular/forms';
import {Directive, Input} from '@angular/core';


export function forbiddenWordsValidation(forbiddenWords: string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const forbidden = forbiddenWords.includes(control.value);
        return forbidden ? {'forbiddenWord': {value: control.value}} : null;
    };
}


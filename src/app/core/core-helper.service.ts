import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
// import { UserDetail } from 'src/app/models/Account.class';

@Injectable({
  providedIn: 'root',
})
export class CoreHelperService {

  friendProfileId: number = 0;
  displayProfile: boolean = true;

  frontOfficeLogin: boolean = true;
  private viewWarehouseDetails = new BehaviorSubject<Object>(false);
  warehouseDetailsData = this.viewWarehouseDetails.asObservable();

  constructor(private titleService: Title, private route: Router) { }

  public updateUserStorage(itemName: string, itemData: any) {
    localStorage.setItem(itemName, JSON.stringify(itemData));
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  // getLoggedinUserDetail = () => {
  //   var userData = localStorage.getItem('adminUserDetail');
  //   if (userData !== null && userData !== undefined && userData !== "") {
  //     return JSON.parse(userData) as UserDetail;
  //   }
  //   else {
  //     return new UserDetail();
  //   }
  // }

  removeSpecialCharacter(event: any) {
    var keyEvent;
    keyEvent = event.charCode; //
    return (
      (keyEvent > 64 && keyEvent < 91) ||
      (keyEvent > 96 && keyEvent < 123) ||
      keyEvent == 8 ||
      keyEvent == 32 ||
      (keyEvent >= 48 && keyEvent <= 57)
    );
  }

  patternPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): any => {
      if (control.value) {
        const regex = new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
        );
        const valid = regex.test(control.value);
        if (!valid) {
          return { invalidPassword: true };
        }
        // return valid ?  null : { invalidPassword: true };
      }
      //const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
    };
  }
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  isStringEmptyOrWhitespace(stringToParse: string) {
    return this.isNullOrUndefined(stringToParse) || stringToParse.trim() === '';
  }

  isNullOrUndefined<T>(tObj: T): boolean {
    return tObj === null || tObj === undefined;
  }

  CompareArraysIgnoreOrder = (a, b) => {
    if (a.length !== b.length) return false;
    const elements = new Set([...a, ...b]);
    for (const x of elements) {
        const count1 = a.filter(e => e === x).length;
        const count2 = b.filter(e => e === x).length;
        if (count1 !== count2) return false;
    }
    return true;
}
}

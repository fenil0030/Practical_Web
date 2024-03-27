import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppLoaderService } from 'src/app/shared/app-loader/app-loader.service';
import { JobService } from 'src/app/shared/services/job.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};


@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
})
export class JobDetailsComponent implements OnInit {

  _jobForm: FormGroup;
  _eduForm: FormGroup;
  _expForm: FormGroup;

  genderDD: string[] = ['Male', 'Female', 'Other']
  locationDD: string[] = ['Ahmedabad', 'Gandhinagar', 'Mehsana']

  eduDetailsArr: any[] = [];
  expDetailsArr: any[] = [];
  eduDataSource = new MatTableDataSource([]);
  expDataSource = new MatTableDataSource([]);
  eduDisplayedCol: string[] = ['university', 'year', 'percentage', 'action'];
  expDisplayedCol: string[] = ['companyName', 'designation', 'fromDate', 'toDate', 'action'];
  pageMode: string = 'add';

  languages: { id: number, languageName: string, isMain: Boolean, canRead: boolean, canWrite: boolean, canSpeak: boolean }[] = [
    { id: 0, languageName: "Hindi", isMain: false, canRead: false, canWrite: false, canSpeak: false, },
    { id: 0, languageName: "English", isMain: false, canRead: false, canWrite: false, canSpeak: false, },
    { id: 0, languageName: "Gujarati", isMain: false, canRead: false, canWrite: false, canSpeak: false, },
  ];

  skills: { id: number, skillName: string, isMain: Boolean, beginner: boolean, mediator: boolean, expert: boolean }[] = [
    { id: 0, skillName: "PHP", isMain: false, beginner: false, mediator: false, expert: false, },
    { id: 0, skillName: "MySQL", isMain: false, beginner: false, mediator: false, expert: false, },
    { id: 0, skillName: "Laravel", isMain: false, beginner: false, mediator: false, expert: false, },
    { id: 0, skillName: "Oracle", isMain: false, beginner: false, mediator: false, expert: false, },
  ];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  jobId: number;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _jobService: JobService,
    private snack: MatSnackBar,
    private router: Router,
    private loader: AppLoaderService
  ) {
    this.BuildJobForm({});
    this.BuildEduForm({});
    this.BuildExpForm({});
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.jobId = Number(this._route.snapshot.params['id']);
    if (this.jobId > 0) {
      this.loader.open();
      this._jobService.getJobById(this.jobId)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((obj: any) => {
          if (obj && Boolean(obj.meta["status"])) {
            this.eduDataSource.data = this.eduDetailsArr = obj.result.educationDetails;
            this.expDataSource.data = this.expDetailsArr = obj.result.workExperience;
            this.languages = obj.result.languages;
            this.skills = obj.result.technicalSkills;
            this.pageMode = 'edit';
            this.BuildJobForm(obj.result)
          } else {
            this.router.navigateByUrl('/jobs/0').then(() => {
              this.router.navigated = false;
              this.router.navigate([this.router.url]);
            });
          }
          this.loader.close();
          this._changeDetectorRef.markForCheck();
        }, (err: any) => {
          this.loader.close();
          this._changeDetectorRef.markForCheck();
        });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  };

  // -----------------------------------------------------------------------------------------------------
  // @ Reactive forms
  // -----------------------------------------------------------------------------------------------------

  BuildJobForm(args: any) {
    this._jobForm = this._formBuilder.group({
      id: [args.id || 0],
      userId: [args.userId || 0],
      name: [args.name, Validators.required],
      email: [args.email, Validators.required],
      address: [args.address],
      gender: [args.gender],
      contact: [args.contact, Validators.required],
      educationDetails: [this.eduDetailsArr],
      workExperience: [this.expDetailsArr],
      languages: [this.languages],
      technicalSkills: [this.skills],
      preferredLocation: [args.preferredLocation, Validators.required],
      expectedCtc: [args.expectedCtc, Validators.required],
      currentCtc: [args.currentCtc, Validators.required],
      noticePeriod: [args.noticePeriod, Validators.required],
    });
  }

  BuildEduForm(args: any) {
    this._eduForm = this._formBuilder.group({
      id: [args.id || 0],
      university: [args.university, Validators.required],
      year: [args.year, Validators.required],
      percentage: [args.percentage, Validators.required],
      isDeleted: [args.isDeleted || false]
    });
  }

  BuildExpForm(args: any) {
    this._expForm = this._formBuilder.group({
      id: [args.id || 0],
      companyName: [args.companyName, Validators.required],
      designation: [args.designation, Validators.required],
      fromDate: [args.fromDate, Validators.required],
      toDate: [args.toDate, Validators.required],
      isDeleted: [args.isDeleted || false]
    });
  }


  // -----------------------------------------------------------------------------------------------------
  // @ public methods
  // -----------------------------------------------------------------------------------------------------

  submit() {
    this.markFormTouched(this._jobForm)
    if (this._jobForm.valid) {
      this.loader.open();
      if (Number(this._jobForm.value.id) > 0) {
        this._jobService.updateJob(this._jobForm.value)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((obj: any) => {
            if (obj && Boolean(obj.meta["status"])) {
              this.snack.open(`Job details updated successfully`, 'OK', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              });
              this.router.navigate(['/jobs'])
            }
            this._changeDetectorRef.markForCheck();
            this.loader.close();
          }, (err: any) => {
            // model.close();
            this.snack.open(err.Message, 'OK', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.loader.close();
            this._changeDetectorRef.markForCheck();
          });
      } else {
        this._jobService.createJob(this._jobForm.value)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((obj: any) => {
            if (obj && Boolean(obj.meta["status"])) {
              this.snack.open(`Job details saved successfully`, 'OK', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              });
              this.router.navigate(['/'])
            }
            this._changeDetectorRef.markForCheck();
            this.loader.close();
          }, (err: any) => {
            // model.close();
            this.snack.open(err.Message, 'OK', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.loader.close();
            this._changeDetectorRef.markForCheck();
          });
      }

    } else {
      return;
    }
  }

  addEdu() {
    if (this._eduForm.valid) {
      this.eduDetailsArr.push(this._eduForm.value);
      this._eduForm.reset();
      this._eduForm.controls["id"].setValue(0);
      this.eduDataSource.data = this.eduDetailsArr;
    }
  }
  removeEdu(obj) {
    const index = this.eduDetailsArr.indexOf(obj);
    this.eduDetailsArr.splice(index, 1);
    if (obj.id > 0) {
      obj.isDeleted = true;
      this.eduDetailsArr.push(obj);
    }
    this.eduDataSource.data = this.eduDetailsArr.filter((x) => x.isDeleted === false);
  }


  addExp() {
    if (this._expForm.valid) {
      if (new Date(this._expForm.value.fromDate) > new Date(this._expForm.value.toDate)) {
        this.snack.open(`Oops... To date should be greater than from date`, 'OK', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        return
      }
      var datePipe = new DatePipe('en-US');
      this._expForm.value.fromDate = datePipe.transform(this._expForm.value.fromDate, 'yyyy-MM-dd');
      this._expForm.value.toDate = datePipe.transform(this._expForm.value.toDate, 'yyyy-MM-dd');
      this.expDetailsArr.push(this._expForm.value);
      this._expForm.reset();
      this._expForm.controls["id"].setValue(0);
      this.expDataSource.data = this.expDetailsArr;
    }
  }
  removeExp(obj) {
    const index = this.expDetailsArr.indexOf(obj);
    this.expDetailsArr.splice(index, 1);
    if (obj.id > 0) {
      obj.isDeleted = true;
      this.expDetailsArr.push(obj);
    }
    this.expDataSource.data = this.expDetailsArr.filter((x) => x.isDeleted === false);
  }


  onLanChange(language) {
    if (language) {
      if (!language.isMain) {
        const index = this.languages.indexOf(language);
        this.languages[index].canRead = false;
        this.languages[index].canWrite = false;
        this.languages[index].canSpeak = false;
      }
    }
  }

  onSkillChange(skill) {
    if (skill) {
      if (!skill.isMain) {
        const index = this.skills.indexOf(skill);
        this.skills[index].beginner = false;
        this.skills[index].mediator = false;
        this.skills[index].expert = false;
      }
    }
  }

  markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  };

}

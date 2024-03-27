import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppConfirmService } from 'src/app/shared/app-confirm/app-confirm.service';
import { AppLoaderService } from 'src/app/shared/app-loader/app-loader.service';
import { JobModel } from 'src/app/shared/models/job.model';
import { JobService } from 'src/app/shared/services/job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contactNo', 'currentCtc', 'expectedCtc', 'noticePeriod', 'action'];
  dataSource = new MatTableDataSource([]);

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  jobArr: JobModel[];
  searchValue: string = '';
  sortOrder: string = '';
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public offset = this.pageSize * 0;
  pagValue: any;

  constructor(
    private _jobService: JobService,
    private router: Router,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef,
    private loader: AppLoaderService
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.getJobList();
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  };


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  getJobList() {
    this.loader.open();
    this._jobService.getJobList(this.offset, this.pageSize, this.sortOrder, this.searchValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((obj: any) => {
        if (obj && Boolean(obj.meta["status"])) {
          this.dataSource.data = obj.result.data as JobModel[];
          // this.dataSource.paginator = this.pagValue;
          this.totalSize = obj.result.totalRecords;
        }
        this.loader.close();
        this._changeDetectorRef.markForCheck();
      }, (err: any) => {
        this.loader.close();
        this._changeDetectorRef.markForCheck();
      });
  };

  editJob(_args: JobModel) {
    if (_args && _args.id > 0) {
      this.router.navigate(['/jobs/' + _args.id])
    }
  }
  deleteJob(_args: JobModel) {
    if (_args && _args.id > 0) {
      this.confirmService.confirm({ message: `` })
        .subscribe(res => {
          if (res) {
            this._jobService.deleteJob(_args.id)
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe((obj: any) => {
                if (obj && Boolean(obj.meta["status"])) {
                  this.snack.open(obj.meta["message"], 'OK', {
                    duration: 4000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                  });
                  this.getJobList();
                }
                this._changeDetectorRef.markForCheck();
              }, (err: any) => {
                this._changeDetectorRef.markForCheck();
              });
          }
        });
    }
  }

  handlePage(e: any) {
    this.pagValue = e;
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.offset = (this.currentPage) * this.pageSize;
    this.getJobList();
  }

  sortColumn($event: Sort) {
    if ($event) {
      this.sortOrder = $event.direction !== '' ? $event.active + '_' + $event.direction : '';
      this.getJobList();
    }
  }

  onTxtSearch(searchedVal: string) {
    if (searchedVal && searchedVal.trim().length >= 3) {
      this.searchValue = searchedVal;
      this.getJobList();
    } else if (searchedVal.trim().length == 0) {
      this.searchValue = '';
      this.getJobList();
    }

  }

}

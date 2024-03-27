import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CoreHttpService } from 'src/app/core/core-http.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({ providedIn: 'root' })
export class JobService extends CoreHttpService {
    private baseUrl: string = environment.baseUrl + '/api/job/';
    constructor(
        _httpClient: HttpClient,
        snack: MatSnackBar,
        router: Router) {
        super(_httpClient, snack, router)
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Job service
    // -----------------------------------------------------------------------------------------------------

    /**
    * Get jobs
    */
    getJobList(offSet: number, pageSize: number, sort: string, searchVal): Observable<any> {
        return this.post<any>(`${this.baseUrl}GetJobs`, {
            pageNumber: offSet,
            pageSize: pageSize,
            sortOrder: sort,
            search: searchVal
        });
    }

    /**
     * Get Job by id
     * @param id
     */
    getJobById(id: number): Observable<any> {
        return this.post<any>(`${this.baseUrl}GetJobById`, {
            Id: id
        })
    }
    /**
     * Create Job
     */
    createJob(jobModel: any): Observable<any> {
        return this.post<any>(`${this.baseUrl}SaveJob`, jobModel);
    }

    /**
     * update Job
     */
    updateJob(jobModel: any): Observable<any> {
        return this.post<any>(`${this.baseUrl}UpdateJob`, jobModel);
    }
    /**
     * Delete the Job
     *
     * @param id
     */
    deleteJob(id: number): Observable<any> {
        return this.post<any>(`${this.baseUrl}SoftDeleteJob`, {
            Id: id
        });
    }

}

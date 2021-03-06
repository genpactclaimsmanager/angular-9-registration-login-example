﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        public httpClient: HttpClient
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            phoneNumber: [''],
            verificationCode:[""]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { 
        return this.form.controls;
     }
    
    SendToVerification(){
         console.log('test');
        }
    onSubmit() {
        this.submitted = true;
       
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.httpClient.post(`${environment.apiUrl}SendPhoneVerficationCode`, { "phone" : this.form.controls.phoneNumber.value }).subscribe((res)=>{
            console.log(res);
            console.log(this.form);
        });

        this.httpClient.post(`${environment.apiUrl}VerifyPhoneValidationCode`, { "phone" : this.form.controls.phoneNumber.value, "code":  this.form.controls.verificationCode.value}).subscribe((res)=>{
            console.log(res);
            console.log(this.form);
        });

        this.loading = true;
        this.accountService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// RxJS
import { finalize, takeUntil, tap, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Auth
import { AuthNoticeService, AuthService } from '../../../../core/auth';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
	selector: 'kt-forgot-password',
	templateUrl: './forgot-password.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
	// Public params
	forgotPasswordForm: FormGroup;
	loading: boolean = true;
	passwordShown: boolean = false;
	submittingForm: boolean = false;
	passwordSuccess: boolean = false;
	invalidPasswordResetCode: boolean = false;
	mode: string = "";
	actionCode: string = "";
	apiKey: string = "";
	continueUrl: string = "";
	newPassword: string = "";
	accountEmail: string = "";
	errorMessage: string = "";
	errors: any = [];

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param authService
	 * @param authNoticeService
	 * @param translate
	 * @param router
	 * @param fb
	 * @param cdr
	 */
	constructor(
		private authService: AuthService,
		public authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private router: Router,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private firebaseAuth: AngularFireAuth,
		private firestore: AngularFirestore,
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.initRegistrationForm();
		this.mode = this.getParameterByName('mode');
		this.actionCode = this.getParameterByName('oobCode');
		this.apiKey = this.getParameterByName('apiKey');
		this.continueUrl = this.getParameterByName('continueUrl');
		console.log(`mode: ${this.mode}`);
		console.log(`actionCode: ${this.actionCode}`);
		console.log(`apiKey: ${this.apiKey}`);
		console.log(`continueUrl: ${this.continueUrl}`);
		switch (this.mode) {
			case 'resetPassword':
				this.handleResetPassword();
				break;
			case 'recoverEmail':
				break;
			case 'verifyEmail':
				break;
			default:
			// Error: invalid mode.
		}
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initRegistrationForm() {
		this.forgotPasswordForm = this.fb.group({
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(20),
			])
			],
			cpassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(20),
			])
			],
		});
	}

	handleResetPassword() {
		this.firebaseAuth.auth.verifyPasswordResetCode(this.actionCode).then((email) => {
			this.accountEmail = email;
			this.invalidPasswordResetCode = false;
			this.loading = false;
		}).catch((error) => {
			this.invalidPasswordResetCode = true;
			this.errorMessage = "Password reset code has expired. Kindly contact your system administrator.";
			this.authNoticeService.setNotice(this.errorMessage, 'danger');
			this.loading = false;
		});

	}

	/**
	 * Form Submit
	 */
	async onSubmit() {
		console.log("onSubmit");
		
	}
	submit() {
		const controls = this.forgotPasswordForm.controls;
		/** check form */
		this.newPassword = this.forgotPasswordForm.controls.password.value;
		if(this.newPassword.length < 8) {
			this.authNoticeService.setNotice('Password must be atleast 8 characters long', 'danger');
			return;
		}
		if (this.forgotPasswordForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;
		this.submittingForm = true;
		this.forgotPasswordForm.disable();
		this.savePassword();
	}

	savePassword() {
		this.firebaseAuth.auth.confirmPasswordReset(this.actionCode, this.newPassword).then((resp) => {
			this.firebaseAuth
				.auth
				.signInWithEmailAndPassword(this.accountEmail, this.newPassword)
				.then((user) => {
					this.router.navigateByUrl('/');
					// this.firestore.collection('partners', (ref) => {
					// 	return ref.where("email", "==", this.accountEmail);
					// }).snapshotChanges()
					// 	.pipe(map(data => data.map(c => ({ key: c.payload.doc.id, ...c.payload.doc.data() }))))
					// 	.subscribe(async (rows) => {
					// 		try {
					// 			await this.firestore.collection('partners')
					// 				.doc(rows[0]['userId'])
					// 				.update({ active: true });
					// 			this.errorMessage = "";
					// 			this.submittingForm = false;
					// 			this.passwordSuccess = true;
					// 			this.errorMessage = "Password saved!";
					// 			this.authNoticeService.setNotice(this.errorMessage, 'success');
					// 			this.router.navigateByUrl('/');
					// 		} catch (error) {
					// 			console.log("error updating record")
					// 			console.log(error);
					// 			this.authNoticeService.setNotice("error updating record", 'danger');
					// 		}
					// 	});
				})
				.catch((loginError) => {
					console.log("login error");
					this.authNoticeService.setNotice("login error", 'danger');
					console.log(loginError);
				});

		}).catch((error) => {
			this.errorMessage = "Error occurred during confirmation.";
			this.authNoticeService.setNotice("Error occurred during confirmation", 'danger');
			console.log(error);
			this.submittingForm = false;
			this.forgotPasswordForm.enable();
		});
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.forgotPasswordForm.controls[controlName];
		if (!control) {
			console.log("not control")
			return false;
		}

		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}

	getParameterByName(name: string) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		const results: RegExpExecArray = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	togglePasswordVisibility() {
		this.passwordShown = !this.passwordShown;
	}
}

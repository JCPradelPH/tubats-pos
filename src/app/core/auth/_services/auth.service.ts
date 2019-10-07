import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
// import { userInfo } from 'os';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';

@Injectable()
export class AuthService {
    constructor(private http: HttpClient, private firebaseAuth: AngularFireAuth) {}
    // Authentication/Authorization
    login(email: string, password: string): Observable<User> {
        console.log('this login was executed');
        return from(this.firebaseAuth.auth.signInWithEmailAndPassword(email, password))
            .pipe(
                map((creds: firebase.auth.UserCredential) => {
                    const userInstance: User = new User();
                    userInstance.id = creds.user.uid;
                    userInstance.email = creds.user.email;
                    userInstance.fullname = creds.user.email;
                    userInstance.accessToken = creds.user.refreshToken;

                    this.firebaseAuth.auth.currentUser.getIdTokenResult(true)
                              .then((idTokenResult) => {
                                 // Confirm the user is an Admin.
                                 if (idTokenResult.claims.isAdmin == false) {
                                   // Show admin UI.
                                   userInstance.isAdmin = 'partner';
                                 } else {
                                   // Show regular user UI.
                                   userInstance.isAdmin = 'admin';
                                 }
                              })
                              .catch((error) => {
                                console.log(error);
                              })

                    return userInstance;
                })
            );
        // return this.http.post<User>(API_USERS_URL, { email, password });
    }

    //Get User Role Admin OR Partner
    
    // isUserAdmin():Observable<Object>{
    //     return this.firebaseAuth.authState.pipe(
    //         first(),
    //         switchMap((user:firebase.User)=> user.getIdToken()),
    //         catchError(val => of(undefined)),
    //         map((token) =>{
    //             if(token){
    //                 return{
    //                     hasToken: false,
    //                     isAdmin: undefined
    //                 };
    //             }
    //             const parsedToken = '';// this.parseJwt(token);
    //             console.log(parsedToken);
    //             return{
    //                 hasToken:true,
    //                 isAdmin: parsedToken["isAdmin"] === undefined
    //             };
    //         })
    //     );
    // }

    // parseJwt(token){
    //     var base64Uri = token.split('.')[1];
    //     var base64 = base64Uri.replace(/-/g,'+').replace(/_/g,'/');
    //     var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c){
    //         return '%' + ('00'+c.charCodeAt(0).toString(16)).slice(-2);
    //     }).join(''));

    //     return JSON.parse(jsonPayLoad);
    // }

    getUserByToken(): Observable<User> {
        return this.firebaseAuth.user
            .pipe(
                map((user: firebase.User) => {
                    const userInstance: User = new User();
                    if(user) {
                        userInstance.id = user.uid;
                        userInstance.email = user.email;
                        userInstance.fullname = user.email;
                        userInstance.accessToken = user.refreshToken;

                        //console.log(`user requested:` + user.email);
                    }
                    return userInstance;
                })
            );
    }

    register(user: User): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders })
            .pipe(
                map((res: User) => {
                    return res;
                }),
                catchError(err => {
                    return null;
                })
            );
    }

    /*
     * Submit forgot password request
     *
     * @param {string} email
     * @returns {Observable<any>}
     */
    public requestPassword(email: string): Observable<any> {
    	return this.http.get(API_USERS_URL + '/forgot?=' + email)
    		.pipe(catchError(this.handleError('forgot-password', []))
	    );
    }


    getAllUsers(): Observable<User[]> {
		return this.http.get<User[]>(API_USERS_URL);
    }

    getUserById(userId: number): Observable<User> {
		return this.http.get<User>(API_USERS_URL + `/${userId}`);
	}


    // DELETE => delete the user from the server
	deleteUser(userId: number) {
		const url = `${API_USERS_URL}/${userId}`;
		return this.http.delete(url);
    }

    // UPDATE => PUT: update the user on the server
	updateUser(_user: User): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_USERS_URL, _user, { headers: httpHeaders });
	}

    // CREATE =>  POST: add a new user to the server
	createUser(user: User): Observable<User> {
    	const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders});
	}

    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<QueryResultsModel>(API_USERS_URL + '/findUsers', queryParams, { headers: httpHeaders});
    }

    // Permission
    getAllPermissions(): Observable<Permission[]> {
		return this.http.get<Permission[]>(API_PERMISSION_URL);
    }

    getRolePermissions(roleId: number): Observable<Permission[]> {
        return this.http.get<Permission[]>(API_PERMISSION_URL + '/getRolePermission?=' + roleId);
    }

    // Roles
    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(API_ROLES_URL);
    }

    getRoleById(roleId: number): Observable<Role> {
		return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
    }

    // CREATE =>  POST: add a new role to the server
	createRole(role: Role): Observable<Role> {
		// Note: Add headers if needed (tokens/bearer)
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Role>(API_ROLES_URL, role, { headers: httpHeaders});
	}

    // UPDATE => PUT: update the role on the server
	updateRole(role: Role): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
	}

	// DELETE => delete the role from the server
	deleteRole(roleId: number): Observable<Role> {
		const url = `${API_ROLES_URL}/${roleId}`;
		return this.http.delete<Role>(url);
	}

    // Check Role Before deletion
    isRoleAssignedToUsers(roleId: number): Observable<boolean> {
        return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?roleId=' + roleId);
    }

    findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<QueryResultsModel>(API_ROLES_URL + '/findRoles', queryParams, { headers: httpHeaders});
	}

 	/*
 	 * Handle Http operation that failed.
 	 * Let the app continue.
     *
	 * @param operation - name of the operation that failed
 	 * @param result - optional value to return as the observable result
 	 */
    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }
}

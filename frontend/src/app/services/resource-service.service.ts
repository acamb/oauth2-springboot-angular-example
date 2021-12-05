import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceServiceService {

  private TEST_URL = 'http://localhost:8101/test/hello'
  private ADMIN_URL = 'http://localhost:8101/test/admin'
  private OPERATOR_URL = 'http://localhost:8101/test/operator'
  constructor(private httpClient: HttpClient, private authService: AuthenticationService) { }

  doTestCall() : Observable<any>{
    if(Number.parseFloat(<string>sessionStorage.getItem("expireDate")) < new Date().getTime()){
      console.log("token expired, removing...");
      this.authService.signOut();
      return new Observable(() => undefined);
    }
    let roles: string[]= JSON.parse(sessionStorage.getItem("roles") || "{}");
    let url = this.TEST_URL
    console.log(roles);
    if(roles.includes('admin')){
        url = this.ADMIN_URL;
    }
    else if(roles.includes('operator')){
      url = this.OPERATOR_URL
    }
    return this.httpClient.get(url)
      .pipe(catchError((error:any) => throwError(() => new Error(JSON.stringify(error) || 'Server error'))));
    
  }

  
}

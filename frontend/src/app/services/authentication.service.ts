import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';

import {User} from "../model/user"

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private clientId = 'test-client';
  private clientSecret = 'deb49192-f2a4-4fb9-bee9-bab24f6eeb8a';
  private redirectUri = 'http://localhost:4200/';
  private LOGIN_URL = `http://localhost:8100/auth/realms/test/protocol/openid-connect/auth?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
  private TOKEN_URL = 'http://localhost:8100/auth/realms/test/protocol/openid-connect/token'
  private REFRESH_URL = 'http://localhost:8100/auth/realms/test/protocol/openid-connect/auth'

  private USER_URL = 'http://localhost:8101/test/user'


  constructor(private httpClient: HttpClient) { }

  isLogged() : boolean {
    return sessionStorage.getItem("token") != undefined;
  }

  checkCode(): boolean{
    return window.location.href.indexOf('code') != -1;
  }

  setToken(){
     let i = window.location.href.indexOf('code');
     if(i != -1) {
       let code = window.location.href.substring(i + 5);
       console.log('code: ' + code);
       let params = new URLSearchParams();
        params.append('grant_type','authorization_code');
        params.append('client_id', this.clientId);
        params.append('client_secret', this.clientSecret);
        params.append('redirect_uri', this.redirectUri);
        params.append('code',code);

        let headers =
          new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});

          this.httpClient.post(this.TOKEN_URL,
            params.toString(), { headers: headers })
            .subscribe({
              next: (token: any) =>  {
                  console.log('response token:' + JSON.stringify(token))
                  if(token.access_token){
                  var expireDate = new Date().getTime() + (1000 * token.expires_in);
                      sessionStorage.setItem("token",token.access_token)
                      sessionStorage.setItem("refreshToken",token.refresh_token)
                      sessionStorage.setItem("expireDate",''+expireDate)
                      console.log('Obtained Access token');
                      window.location.href = 'http://localhost:4200';
                  }
                  else{
                    alert('Invalid Response?')
                  }
              },
              error: () => alert('Invalid Credentials')
            });
     }
  }

  redirectToLogin(){
    window.location.href = this.LOGIN_URL;
  }

  refreshToken() {
    return this.httpClient.post(this.REFRESH_URL + '/refreshtoken', {
      refreshToken: sessionStorage.getItem("refreshToken")
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  signOut(){
    window.sessionStorage.clear();
    
  }

  getUser(): Observable<any> {
    return this.httpClient.get<User>(this.USER_URL)
      .pipe(
        map( user => {
          sessionStorage.setItem("roles",JSON.stringify(user.roles))
          return user
        })
      )
  }

  
    
}

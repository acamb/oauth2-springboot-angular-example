import { ResourceServiceService } from './services/resource-service.service';
import { AuthenticationService } from './services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = 'test-oauth2-client';
  message = ""

  constructor(private authService: AuthenticationService,private resourceService: ResourceServiceService){

  }

  ngOnInit(): void {
    if(this.authService.isLogged()){
        if(!sessionStorage.getItem("roles")){
          this.authService.getUser().subscribe(
            {
              next: (user) => {
                console.log(JSON.stringify(user));
                this.resourceService.doTestCall().subscribe((data) => this.message = data)
              },
              error: ()=> throwError(()=>new Error(""))
            }
          )
        }
          else{
        this.resourceService.doTestCall().subscribe((data) => this.message = data)
        }
    }
    else if(this.authService.checkCode()){
      this.authService.setToken();
    }
    else{
      this.authService.redirectToLogin();
    }
  }
}

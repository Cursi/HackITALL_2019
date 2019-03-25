import { Component, OnInit, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare const gapi: any;

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit 
{
  constructor(private element: ElementRef, private dataService: DataService, private router: Router) { }
  private clientId:string = '';

  private scope = 
  [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  public auth2: any;

  public googleInit() 
  {        
    gapi.load('auth2', () => 
    {
      this.auth2 = gapi.auth2.init(
      {
        client_id: this.clientId,
        cookiepolicy: 'single_host_origin',
        scope: this.scope
      });

      this.attachSignin(this.element.nativeElement.querySelector('#signInBtn'));
    });
  }

  public attachSignin(element) 
  {
    this.auth2.attachClickHandler(element, {}, (googleUser) => 
    {
      console.log(googleUser.getAuthResponse().id_token);
      this.dataService.sendGoogleToken(googleUser.getAuthResponse().id_token);
    }, function (error)
    {
      console.log(JSON.stringify(error, undefined, 2));
    });
  }

  TryRedirectToHome()
  {
    if(localStorage.getItem("token"))
    {
      if(localStorage.getItem("owner") == "1")  this.router.navigateByUrl("/offers");
      else this.router.navigateByUrl("/home");
    }
    else this.googleInit();
  }

  ngOnInit()
  {
    this.TryRedirectToHome();
  }
}
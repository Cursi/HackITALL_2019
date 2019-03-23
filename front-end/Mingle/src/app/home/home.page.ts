import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private googlePlus: GooglePlus, private platform: Platform) {}

  CordovaGoogleLogin()
  {
    this.googlePlus.login({})
        .then(res => alert(JSON.stringify(res, null, 4)))
        .catch(err => alert("Error: " + JSON.stringify(err, null, 4)));
  }

  WebGoogleLogin()
  {
    
  }

  loginGoogle() 
  {
    if(this.platform .is("cordova")) this.CordovaGoogleLogin();
    else this.WebGoogleLogin();
  }

}

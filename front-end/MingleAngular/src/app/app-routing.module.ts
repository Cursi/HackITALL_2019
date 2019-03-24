import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { AddOferComponent } from './add-ofer/add-ofer.component';

const routes: Routes = 
[
  {
    path: "",
    component: SignInComponent 
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "offers", 
    component: AddOferComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

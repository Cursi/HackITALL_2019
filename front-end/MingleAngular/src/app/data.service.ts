import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService 
{
  metaConsts =
  {
    baseURL: "backend_url"
  }

  constructor(private http: HttpClient) { }

  sendGoogleToken(googleToken) 
  {
    this.http.post(this.metaConsts.baseURL + "/login",
     {token: googleToken}).subscribe((response: any) =>
     {
        localStorage.setItem("token", response.token);
        localStorage.setItem("email", response.email);
        localStorage.setItem("firstname", response.firstname);
        localStorage.setItem("lastname", response.lastname);
        localStorage.setItem("owner", response.owner);
        localStorage.setItem("photo", response.photo);

        window.location.reload();
      }
    );
  }

  genericRequest(URL: String, method: String, body?: Object) 
  {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem("token") });
    switch (method) 
    {
      case "GET":
        return this.http.get(this.metaConsts.baseURL + URL, { headers: headers });
      case "DELETE":
        return this.http.delete(this.metaConsts.baseURL + URL, { headers: headers });
      case "POST":
        return this.http.post(this.metaConsts.baseURL + URL, body, { headers: headers });
      case "PUT":
        console.log("put");
        break;
    }
  }
}
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  initialCoordinates = 
  {
    latitude: 0,
    longitude: 0
  }

  zoom = 17;

  ngOnInit()
  {
    navigator.geolocation.getCurrentPosition((currentLocation) =>
    {
      this.initialCoordinates = currentLocation.coords;
      console.log(this.initialCoordinates);
    });
  }
}

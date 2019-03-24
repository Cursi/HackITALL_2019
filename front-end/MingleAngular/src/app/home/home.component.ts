import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
// import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
// import { google } from '@agm/core/services/google-maps-types';

// import {} from "googlemaps";
// import {google} from "@google/maps";

// declare var google : any;
// import {} from 'googlemaps';

// declare const google: any;
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit 
{
  constructor(private dataService: DataService, private router: Router) { }

  currentRadius = 100;

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  
  LoadMap()
  {
    navigator.geolocation.getCurrentPosition((currentLocation) =>
    {
      var mapProp = 
      {
        center: new google.maps.LatLng(currentLocation.coords.latitude, currentLocation.coords.longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      this.map.addListener("zoom_changed", () => this.ComputeRadius());

      var self = this;

      google.maps.event.addListenerOnce(this.map, 'bounds_changed', function()
      {
        self.ComputeRadius();
      });
    });
  }

  SearchInRange()
  {
    var request = 
    {
      radius: this.currentRadius,
      type: 'restaurant',
      location: this.map.getCenter(),
      fields: ['formatted_address', 'geometry', 'icon', 'id', 'name', 'permanently_closed', 'photos', 'place_id', 'plus_code', 'types', 'user_ratings_total']
    };
  
    console.log(this.map.getCenter().lat() + " " + this.map.getCenter().lng());

    var placeService = new google.maps.places.PlacesService(this.map);
    placeService.nearbySearch(request, (result, status) =>
    {
      console.log(status);

      if (status === google.maps.places.PlacesServiceStatus.OK)
      {
        this.dataService.passRoutingData(result);
        this.router.navigateByUrl("/places");
      }
    });
  }

  ComputeRadius()
  {
    function degrees_to_radians(degrees)
    {
      var pi = Math.PI;
      return degrees * (pi/180);
    }

    console.log(this.map.getCenter().lat() + " " + this.map.getCenter().lng());
    console.log(this.map.getBounds().getNorthEast().lat() + " " + this.map.getBounds().getNorthEast().lng());
    	
    var R = 6371e3; // metres
    var φ1 = degrees_to_radians(this.map.getCenter().lat());
    var φ2 = degrees_to_radians(this.map.getBounds().getNorthEast().lat());
    var Δφ = degrees_to_radians(this.map.getBounds().getNorthEast().lat()-this.map.getCenter().lat());
    var Δλ = degrees_to_radians(this.map.getBounds().getNorthEast().lng()-this.map.getCenter().lng());

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    this.currentRadius = d / 4;
    console.log(this.currentRadius);
  }

  DebugZoom()
  {
    setInterval(() =>
    {
      console.log(this.map.getZoom());
    }, 500);
  }

  ngOnInit()
  {
    this.LoadMap();
    // this.DebugZoom();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router } from '@angular/router';
// import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
// import { google } from '@agm/core/services/google-maps-types';

// import {} from "googlemaps";
// import {google} from "@google/maps";

// declare var google : any;
// import {} from 'googlemaps';

// declare const google: any;

declare const M: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit 
{
  constructor(private dataService: DataService, private router: Router) { }

  currentRadius = 100;
  currentPlaces = null;
  searchModalInstance = null;

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
  
    var placeService = new google.maps.places.PlacesService(this.map);
    placeService.nearbySearch(request, (result, status) =>
    {
      if (status === google.maps.places.PlacesServiceStatus.OK)
      {
        console.log(result);
        this.currentPlaces = result;
        this.searchModalInstance[0].open();
        document.getElementById("modal1").click();
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
  }

  LoadProfile()
  {
    document.getElementById("profileCircle").setAttribute("src", localStorage.getItem("photo"));
    document.getElementById("profileCircleNav").setAttribute("src", localStorage.getItem("photo"));
    document.getElementById("profileNameNav").innerHTML = localStorage.getItem("firstname") + " " + localStorage.getItem("lastname");
    document.getElementById("profileNameMail").innerHTML = localStorage.getItem("email");

    var self = this;

    document.addEventListener('DOMContentLoaded', function() 
    {
      M.Sidenav.init(document.querySelectorAll('.sidenav'), null);
      self.searchModalInstance = M.Modal.init(document.querySelectorAll(".modal"), {dismissible: false});
    });
  }

  GoogleSignOut()
  {
    localStorage.clear();
    document.getElementsByClassName("sidenav-overlay")[0].setAttribute("style", "display: none;");
    this.router.navigateByUrl("");
  }

  AddToFollow()
  {

  }

  OpenDirectionsLink(data)
  {
    window.open("https://maps.google.com/?q=" + data);
  }

  OpenMenuLink()
  {
    window.open(this.dataService.metaConsts.baseURL + "/menu");
  }

  ngOnInit()
  {
    console.log(localStorage);
    this.LoadMap();
    this.LoadProfile();
  }
}
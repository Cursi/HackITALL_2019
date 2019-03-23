import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
// import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
// import { google } from '@agm/core/services/google-maps-types';

// import {} from "googlemaps";
// import {google} from "@google/maps";

// declare var google : any;
// import {} from 'googlemaps';

// declare const google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit 
{
  constructor(private dataService: DataService) { }

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
      console.log(status);

      if (status === google.maps.places.PlacesServiceStatus.OK)
      {
        console.log(result);
      }
    });
  }

  ComputeRadius()
  {
    console.log(this.map.getZoom());
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
    // this.DebugZoom();
  }

  ngAfterViewInit()
  {
    this.LoadMap();
  }
}

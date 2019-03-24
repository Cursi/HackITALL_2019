import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-places-list',
  templateUrl: './places-list.component.html',
  styleUrls: ['./places-list.component.css']
})
export class PlacesListComponent implements OnInit {

  private places: Object[];
  public isLoaded: Boolean = false;
  constructor(private dataService: DataService) {
    let self = this;
    this.dataService.getData.subscribe((result: Object[]) => {
      self.places = result;
      self.isLoaded = true;
      console.log(self.places);
    })
  }

  ngOnInit() {
    
  }

}
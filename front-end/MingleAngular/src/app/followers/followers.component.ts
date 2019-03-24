import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {

  followers : [];

  constructor(private dataService : DataService) {
    this.dataService.genericRequest("/place/favorite", "GET")
    .subscribe(result => {
      this.followers = result["places"];
    })
   }

  ngOnInit() {
    
  }

  deleteOffer(element: any){
    this.dataService.genericRequest("/place/favorite/remove/" + element.id, "DELETE")
    .subscribe(result => {
      this.followers.splice(this.followers.indexOf(<never>element), 1);
    })
  }

}

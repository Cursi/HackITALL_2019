import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-add-ofer',
  templateUrl: './add-ofer.component.html',
  styleUrls: ['./add-ofer.component.css']
})
export class AddOferComponent implements OnInit {

  offers = [];
  expanded = true;
  offer = "";
  constructor(private dataService: DataService) {
    this.offers.push({message: "offer1"});
    this.offers.push({message: "offer1"});
    this.offers.push({message: "offer1"});

    this.dataService.genericRequest("/offer/owner", "GET").subscribe(response => {
      this.offers = response["offers"];
    })
  }

  ngOnInit() {
  }

  expand(){
    this.expanded = !this.expanded;
  }

  addOffer(){
    this.dataService.genericRequest("/offer", "POST", {offer: this.offer}).subscribe(response => {
      this.offers.push(response["newOffer"]);
      this.dataService.genericRequest("/notification", "POST", {title: "asd"}).subscribe(response => {
        console.log(response);
      })
    })
  }

  deleteOffer(index){
    this.dataService.genericRequest("/offer/" + index.id, "DELETE").subscribe(response => {
      this.offers.splice(this.offers.indexOf(index), 1);
    })
  }

}

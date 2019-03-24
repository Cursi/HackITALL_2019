import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

declare const M: any;

@Component({
  selector: 'app-add-ofer',
  templateUrl: './add-ofer.component.html',
  styleUrls: ['./add-ofer.component.css']
})
export class AddOferComponent implements OnInit {

  isOwner: String;
  offers = [];
  expanded = true;
  offer = "";
  constructor(private dataService: DataService) {
    this.offers.push({message: "offer1"});
    this.offers.push({message: "offer1"});
    this.offers.push({message: "offer1"});

    var placeID = localStorage.getItem("offerId");

    if(placeID)
    {
      this.dataService.genericRequest("/offer/" + placeID, "GET").subscribe(response => 
      {
        this.offers = response["offers"];
      });
    }
    else
    {
      this.dataService.genericRequest("/offer/owner", "GET").subscribe(response => 
      {
        this.offers = response["offers"];
      });
    }
  }

  InitModal()
  {
    document.addEventListener('DOMContentLoaded', function() 
    {
      var elems = document.querySelectorAll('.modal');
      var instances = M.Modal.init(elems, null);
    });
  }

  SendOffer()
  {
    this.offer = document.getElementById("offerTextArea")["value"];

    this.dataService.genericRequest("/offer", "POST", {offer: this.offer}).subscribe(response => 
      {
      this.offers.push(response["newOffer"]);
      this.dataService.genericRequest("/notification", "POST", {offer: this.offer}).subscribe(response => 
        {
        console.log(response);
      })
    });

    document.getElementById("offerTextArea")["value"] = "";
  }

  ngOnInit() 
  {
    this.InitModal();
    this.isOwner = localStorage.getItem("owner");
  }

  deleteOffer(index){
    this.dataService.genericRequest("/offer/" + index.id, "DELETE").subscribe(response => {
      this.offers.splice(this.offers.indexOf(index), 1);
    })
  }

}

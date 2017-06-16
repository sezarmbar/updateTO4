import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { addresShared , ADDRESES} from '../../../service';
import {MapsAPILoader} from 'angular2-google-maps/core';
import { DirectionsMapDirective } from '../haus-map/DirectionsMap.Directive';

declare var google:any;

@Component({
  selector: 'side-map',
  templateUrl: './side-map.component.html',
  styleUrls: ['./side-map.component.css']
})
export class SideMapComponent implements OnInit {
 @Input() elPlanRout:any;
 @Input() parkNane:any;
 public parkhauseAddreses = ADDRESES;
 public title: string = 'oldenburg';
 public oldenburgLat: number = 53.1432439 ;
 public oldenburgLng: number = 8.2214212 ;
 public zoom: number = 16;
 public destLat: number ;
 public destLng: number ;
 public oriLat: number;
 public oriLng: number;
 public directionsDisplay:any;
 public destination = { lat: 0.0, lng: 0.0 };
 public sideelPlanRout:any;
 public styleArray = [
    {
      featureType: 'all',
      stylers: [
        { saturation: -80 }
      ]
    }, {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        { hue: '#00ffee' },
        { saturation: 50 }
      ]
    },{
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    }
  ];
@ViewChild(DirectionsMapDirective) directionRender;

  constructor(  public addresService:addresShared,  public mapsAPILoader:MapsAPILoader) {
    if(this.directionsDisplay === undefined){ this.mapsAPILoader.load().then(() => { 
      this.directionsDisplay = new google.maps.DirectionsRenderer; }); }
  }
  
  ngOnInit() {
  console.log("commponennt init")
    
    this.sideelPlanRout = this.elPlanRout;
    this.currentlocationFind();
  }

  serchAddres(destenyInput){
     for(var i =0;i<this.parkhauseAddreses.length;i++){
       let parkHaus = this.parkhauseAddreses[i];
      //  if(parkHaus.name===this.parkNane){
       if(parkHaus.name===destenyInput){
        //  this.destLat = Number(parkHaus.lat);
        //  this.destLng = Number(parkHaus.lng);
         this.destination.lat = Number(parkHaus.lat);
         this.destination.lng = Number(parkHaus.lng);
       }
     }
    //  if(this.destination.lat)
     this.directionRender.renderDirection();
   }


   currentlocationFind(){
    if (!navigator.geolocation){
        console.log("<p>Geolocation is not supported by your browser</p>");
      }
     if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((location) => {
               this.setLatLng(location.coords.latitude, location.coords.longitude);
            });
        }
   }
   setLatLng(lat:number, lng:number) {
        this.oriLat = lat;
        this.oriLng = lng;
    }
    ngOnDestroy(){
      console.log("commponennt destroyed")
    }

}

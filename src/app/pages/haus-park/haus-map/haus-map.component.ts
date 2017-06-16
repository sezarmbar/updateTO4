import { Component, ViewChild, ViewContainerRef, ElementRef, OnInit } from '@angular/core';
import { MdSidenav, MdDialog, MdDialogConfig } from "@angular/material";
import { MapsAPILoader, SebmGoogleMapInfoWindow } from 'angular2-google-maps/core';
import { ParkingsService, addresShared, ADDRESES } from '../../../service';

import { DirectionsMapDirective } from './DirectionsMap.Directive';

declare var google: any;
declare var Audio: any;
// http://gis4oldenburg.oldenburg.de/?es=C12S77
@Component({
  selector: 'app-haus-map',
  templateUrl: './haus-map.component.html',
  styleUrls: ['./haus-map.component.scss']
})
export class HausMapComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MdSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MdSidenav;
  @ViewChild(DirectionsMapDirective) directionRender;
  @ViewChild('planRoutMap') elPlanRout: ElementRef;
  public tmp = '((53.12817645691219, 8.180056798706119), (53.16266808904921, 8.26743243957526))';
  public showside: boolean = false;
  public title: string = 'oldenburg';
  public oldenburgLatLng = { lat: 53.1432439, lng: 8.2214212 };
  public zoom: number = 14;
  public destenyInput = '';
  public parkhauseAddreses = ADDRESES;
  public destination = { lat: 0.0, lng: 0.0 };
  public autoPosition: any;
  public btnSideNave: string = 'chevron_right';
  public opened: boolean = false;
  public btnSideNaveEnd: string = 'chevron_left';
  public openedEnd: boolean = false;
  public directionsDisplay: any;
  public watchID: any;
  public markerIcon: any;
  public currentPosition: any;
  public markerPos = { lat: 0.0, lng: 0.0 };
  public wakeLock;
  public parksFBehindertes: any;
  public freiParkPlatz: any;
  public parkPlatz: any;
  public parkHause: any;
  public parksFBehindertesShow: boolean = false;
  public freiParkPlatzShow: boolean = false;
  public ParkHauseShow: boolean = false;
  public parkPlatzShow: boolean = false;
  public strassensperrungShow: boolean = false;
  public grosseUmleitungenShow: boolean = false;
  public strassensperrungColor: string = '#FF0000';
  public grosseUmleitungenColor: string = '#0000ff';
  public infoMarker: any;
  public strassensperrung = [];
  public grosseUmleitungen = [];
  public lastclickedMarker: any;
  public currentMarkerId: any;
  public lastUkat: number;
  origin:any;
  isClicked: boolean;
  lastClicked: SebmGoogleMapInfoWindow;
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
    }, {
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    }
  ];

  constructor(  public addresService: addresShared,   public mapsAPILoader: MapsAPILoader,   public parkingsService: ParkingsService) {
    if (this.directionsDisplay === undefined) {
      this.mapsAPILoader.load().then(() => {
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.markerIcon = new google.maps.MarkerImage('assets/mobileimgs2.png',
          new google.maps.Size(22, 22),
          new google.maps.Point(0, 18),
          new google.maps.Point(11, 11));
      });
    }
  }
  ngOnInit() {
    this.getParksFBehinderte();
    this.getFreiParkPlatz();
    this.getParkPlatz();
    this.getParkHause();
    this.getStrassensperrung();
    this.getGrosseUmleitungen();
    this.destenyInput = this.addresService.parkhausname;
    this.serchAddres();
    this.setMaker();
    console.log(this.tmp.replace(/([. *+?^=!:${}()|\[\]\/\\])/g, ''));
    // var audio = new Audio('assets/audio01.mp3');
    // audio.play();
  }

  carePositsion() {
    navigator.geolocation.clearWatch(this.watchID);
    if (!navigator.geolocation) {
      console.log('<p>Geolocation is not supported by your browser</p>');
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        this.autoPosition = { lat: location.coords.latitude, lng: location.coords.longitude };
        this.addresService.setAutoPosition(this.autoPosition);
      });
    }
  }
  resetPos() {
    this.addresService.resetCarePositsion();
  }
  clearDirection() {
    this.directionRender.clearDirection();
  }
  serchAddres() {
    for (let i = 0; i < this.parkhauseAddreses.length; i++) {
      let parkHaus = this.parkhauseAddreses[i];
      if (parkHaus.name === this.destenyInput) {
        this.destination.lat = Number(parkHaus.lat);
        this.destination.lng = Number(parkHaus.lng);
      }
    }
  }
  toAuto() {
    this.destination.lat = Number(this.addresService.autoPosition.autoPoLat);
    this.destination.lng = Number(this.addresService.autoPosition.autoPoLng);
    this.directionRender.renderDirection('WALKING');
  }
  closeOpenSidenave() {
    if (this.sidenav._opened === true) {
      this.opened = false;
      this.sidenav.close();
      this.btnSideNave = 'chevron_right';
    }
    if (this.sidenav._isClosed === true) {
      this.opened = true;
      this.sidenav.open();
      this.btnSideNave = 'chevron_left';
    }
  }

  closeOpenSidenaveEnd() {
    if (this.sidenavEnd._opened === true) {
      this.openedEnd = false;
      this.sidenavEnd.close();
      this.btnSideNaveEnd = 'chevron_left';
    }
    if (this.sidenavEnd._isClosed === true) {
      this.openedEnd = true;
      this.sidenavEnd.open();
      this.btnSideNaveEnd = 'chevron_right';
    }
  }
  // marker current position for novigatsion 
  setMaker() {
    let me = this;
    if (navigator.geolocation) {
      // timeout at 20000 milliseconds (20 seconds)
      const options = { timeout: 20000, enableHighAccuracy: true, maximumAge: 0 };
      this.watchID = navigator.geolocation.watchPosition(position => {
        me.markerPos.lat = position.coords.latitude;
        me.markerPos.lng = position.coords.longitude;
      },
        err => {
          if (err.code === 1) {
            console.log('Error: Access is denied!');
          } else if (err.code === 2) {
            console.log('Error: Position is unavailable!');
          }
        }
        , options);
    } else {
      console.log('Sorry, browser does not support geolocation!');
    }
  }
  getParkPlatz() {
    this.parkingsService.getParkPlatz().subscribe(
      (markers) => {
        this.parkPlatz = markers;
      });
  }
  getFreiParkPlatz() {
    this.parkingsService.getFreiParkPlatz().subscribe(
      (markers) => {
        this.freiParkPlatz = markers;
      });
  }

  getParksFBehinderte() {
    this.parkingsService.getParksFBehinderte().subscribe(
      (markers) => {
        this.parksFBehindertes = markers;
      });
  }
  getParkHause() {
    this.parkingsService.getParkHause().subscribe(
      (markers) => {
        this.parkHause = markers;
      });
  }
  getStrassensperrung() {
    this.parkingsService.getStrassen(388).subscribe(
      (lines) => this.strassensperrung = lines);
  }
  getGrosseUmleitungen() {
    this.parkingsService.getStrassen(391).subscribe(
      (lines) => this.grosseUmleitungen = lines);
  }
  chckeMrkerGroup() {
    if (!(this.parksFBehindertesShow) && this.lastUkat == 364) { this.lastClicked = null; this.lastUkat = null; }
    if (!(this.freiParkPlatzShow) && this.lastUkat == 78) { this.lastClicked = null; this.lastUkat = null; }
    if (!(this.ParkHauseShow) && this.lastUkat == 77) { this.lastClicked = null; this.lastUkat = null; }
    if (!(this.parkPlatzShow) && this.lastUkat == 14) { this.lastClicked = null; this.lastUkat = null; }
  }
  getInfoMarker(id, infoWindow, ukat) {
    this.infoMarker = 'Laden...'
    //  this.chckeMrkerGroup();
    this.parkingsService.getInfoMarker(id).subscribe(
      (infoMarker) => {
        // this.infoMarker = infoMarker.replace(/<{1}[^<>]{1,}>{1}/g," ");
        this.infoMarker = infoMarker.replace(/<\/title>$/);
      });
    if (this.lastClicked && this.lastClicked !== infoWindow) {
      this.lastClicked.close();
    }
    this.lastClicked = infoWindow;
    this.lastUkat = ukat;
  }
  toCurrentMarker(marker) {
    this.currentMarkerId = marker.id;
    this.destination.lat = Number(marker.lat);
    this.destination.lng = Number(marker.lon);
    this.directionRender.renderDirection();
    this.lastClicked = null;
    this.parksFBehindertesShow = false;
    this.freiParkPlatzShow = false;
    this.ParkHauseShow = false;
    this.parkPlatzShow = false;
    this.strassensperrungShow = false;
    this.grosseUmleitungenShow = false;
  }
  mapClicked($event) {
    console.log(this.freiParkPlatz)
    this.isClicked = false;
    if (this.lastClicked) {
      this.lastClicked.close();
      this.lastClicked = null;
    }
  }
  ngOnDestroy() {
    navigator.geolocation.clearWatch(this.watchID);
  }
}
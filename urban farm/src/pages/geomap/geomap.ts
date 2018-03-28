import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
// import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';

import { BasicinfoPage } from '../../pages/basicinfo/basicinfo';




/**
 * Generated class for the GeomapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-geomap',
  templateUrl: 'geomap.html',
})
export class GeomapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  currentPos: Geoposition;
  options: GeolocationOptions;
  places: Array<any>;
  showMe: any = true;
  searchFor: any = "Farmers and crops";

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private geolocation: Geolocation, private googleMaps: GoogleMaps) {
    platform.ready().then(() => {
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad GeomapPage');

    let mapOptions = {
      center: { lat: -34.9011, lng: -56.1645 },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    this.getUserPosition();
  }


  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()

    });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');


    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }


  getRestaurants(latLng) {
    var service = new google.maps.places.PlacesService(this.map);
    var request = {
      location: latLng,
      radius: 800,
      types: [this.searchFor],
      center: latLng,
      disableDefaultUI: true
    };
    return new Promise((resolve, reject) => {
      service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }

      });
    });

  }
  show() {
    this.showMe = true;
  }
  createMarker(place) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location
    });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
    marker.addListener('click', () => {
      //this.someProperty = Math.random();
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      this.showMe= false;
    });
  }
  addMap(lat, long) {

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center: latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    this.getRestaurants(latLng).then((results: Array<any>) => {
      this.places = results;
      for (let i = 0; i < results.length; i++) {
        // if(this.searchFor != " "){
        this.createMarker(results[i]);
      }
    }, (status) => console.log(status));

    this.addMarker();

  }

  getUserPosition() {
    console.log("getting user position");
    this.options = {
      enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {

      this.currentPos = pos;

      console.log(pos);
      this.addMap(pos.coords.latitude, pos.coords.longitude);

    }, (err: PositionError) => {
      console.log("error : " + err.message);
      ;
    })
  }
  pageredirection() {
    this.navCtrl.push(BasicinfoPage);
  }

}

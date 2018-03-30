import { Component , NgZone, ViewChild ,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, ActionSheetController, ToastController, Platform, Loading } from 'ionic-angular';

import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { RestProvider } from '../../providers/rest/rest';

import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
// import {SecureStorage} from 'ionic-native';

// import { ViewChild } from '@angular/core'

// import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';

// import { Geolocation } from '@ionic-native/geolocation';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { CropselectPage } from '../../pages/cropselect/cropselect';
import { LatlngupdatePage } from '../../pages/latlngupdate/latlngupdate';


/**
 * Generated class for the BasicinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-basicinfo',
  templateUrl: 'basicinfo.html',
})
export class BasicinfoPage {
  @ViewChild('map') mapElement: ElementRef;

  lastImage: string = null;
  loadingimg: Loading;
  locationSelected: any;

  map: any;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  loading: any;
  xyz :any;

  nickName:any;
  languages:any = "English";
  imageUrl:any = "somevalue";
  selectlocationLatLang:any;
  phoneNumber:any;


currentPos : Geoposition;
options : GeolocationOptions;
places : Array<any> ;
showMe:any = true;
searchFor:any = "Farmers and crops";

showBasicInfoPage:any=  false;
// showMe : fales;
resdata: any;
errorMessage: any;
// private secureStorage:SecureStorage;
data:any;
error:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public zone: NgZone,
              public geolocation: Geolocation,
              public loadingCtrl: LoadingController,

              private camera: Camera,
              private transfer: Transfer,
              private file: File,
              private filePath: FilePath,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public platform: Platform,
              private googleMaps: GoogleMaps,
              public restService: RestProvider,
             private secureStorage:SecureStorage

            ) {
                this.geocoder = new google.maps.Geocoder;
                let elem = document.createElement("div")
                this.GooglePlaces = new google.maps.places.PlacesService(elem);
                this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
                this.autocomplete = {input: ''  };
                this.autocompleteItems = [];
                this.markers = [];
                this.loading = this.loadingCtrl.create();

                this.platform.ready().then(() => {
                  this.secureStorage.create('my_store_name')
                  .then((storage: SecureStorageObject) => {

                     storage.get('key')
                       .then(
                           data => console.log(data),
                         error => console.log(error)
                     );

                     storage.set('key', 'value')
                       .then(
                        data => console.log(data),
                         error => console.log(error)
                     );

                     storage.remove('key')
                     .then(
                         data => console.log(data),
                         error => console.log(error)
                       );

                        });
                });
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BasicinfoPage');

     // this.map = new google.maps.Map(document.getElementById('map'), {
     //   center: {lat: -34.9011, lng: -56.1645},
     //   zoom: 15,
     //   mapTypeId: google.maps.MapTypeId.ROADMAP,
     //   disableDefaultUI: true
     // });
     // this.getUserPosition();




  }

  ionViewDidEnter(){

   //  this.map.addListener('click', (e)=> {
   //     // this.map.Marker.remove();
   //    this.selectlocation(e.latLng)
   //
   // });

  }
  basicinfo(){

    let options = {
      nickName : this.nickName,
      imageUrl: "this.imageUrl" ,
      phoneNumber: this.phoneNumber,
      connections: 'false'
    };
    if (options.nickName == ' ' || typeof (options.nickName) == "undefined") {
      alert('Provide valid info');
    } else {
      this.restService.basicInfo(options)
        .subscribe(
        resdata => {this.resdata= resdata; console.log("res basicInfo : " + this.resdata._id);this.restService.userId=  this.resdata._id ;this.pageredirection();},//{ this.resdata = resdata; if (this.resdata != "") { if (this.resdata[0].Email == options.email && this.resdata[0].Email != '') this.navCtrl.push(HomePage); { console.log(JSON.stringify(this.resdata[0]['_id'])) } } else { alert('Pleas Provide valid Information') }; },
        error => {this.errorMessage = <any>error; console.log("res basicInfo : " + JSON.stringify(this.errorMessage ));});

    }
    this.pageredirection();
  }

  // login() {
  //   let options = {
  //     email: this.email,
  //     password: this.password
  //   };
  //   if (options.email == ' ' || typeof (options.email) == "undefined") {
  //     alert('Provide valid info');
  //   } else {
  //     //console.log( JSON.stringify(options));
  //     this.restService.loginAuth(options)
  //       .subscribe(
  //       resdata => { this.resdata = resdata; if (this.resdata != "") { if (this.resdata[0].Email == options.email && this.resdata[0].Email != '') this.navCtrl.push(HomePage); { console.log(JSON.stringify(this.resdata[0]['_id'])) } } else { alert('Pleas Provide valid Information') }; },
  //       error => this.errorMessage = <any>error);
  //   }
  // }

showBasicInfoPagefun(){
  this.showBasicInfoPage=true;
}

  pageredirection(){
    this.navCtrl.push(LatlngupdatePage);
  }

//////////////////////image uploading /////////////////////////////////////////
public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

public takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };

  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}



private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}

// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    this.presentToast('Error while storing file.');
  });
}

private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}

// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return 'http://www.alrisalahschool.com/wp-content/uploads/2017/06/profile-image-default-200x200.jpg';
  } else {
    return cordova.file.dataDirectory + img;
  }
}

public uploadImage() {
  // Destination URL
  var url = "http://localhost:8100/ionic-lab/";

  // File for Upload
  var targetPath = this.pathForImage(this.lastImage);

  // File name only
  var filename = this.lastImage;
this.imageUrl = url + targetPath  +filename ;
  var options = {
    fileKey: "file",
    fileName: filename,
    chunkedMode: false,
    mimeType: "multipart/form-data",
    params : {'fileName': filename}
  };

  const fileTransfer: TransferObject = this.transfer.create();

  this.loadingimg = this.loadingCtrl.create({
    content: 'Uploading...',
  });
  this.loadingimg.present();

  // Use the FileTransfer to upload the image
  fileTransfer.upload(targetPath, url, options).then(data => {
    this.loadingimg.dismissAll()
    this.presentToast('Image succesful uploaded.');
  }, err => {
    this.loadingimg.dismissAll()
    this.presentToast('Error while uploading file.');
  });
}
//////////////////////image uploading /////////////////////////////////////////
  //
  // selectlocation(latLng){
  //
  //   this.locationSelected =  JSON.stringify(latLng);
  //   this.clearMarkers();
  //   let marker = new google.maps.Marker({
  //     position: latLng,
  //     map: this.map
  //   });
  //   this.markers.push(marker);
  //   // this.map.setCenter(latLng);
  //     // let marker = new google.maps.Marker({
  //     //   position: latLng,
  //     //   map: map
  //     // });
  //     // this.map.panTo(latLng);
  // }
  //
  // tryGeolocation(){
  //   this.loading.present();
  //   this.clearMarkers();//remove previous markers
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     let pos = {
  //       lat: resp.coords.latitude,
  //       lng: resp.coords.longitude
  //     };
  //     // console.logo(pos);
  //     let marker = new google.maps.Marker({
  //       position: pos,
  //       map: this.map,
  //       title: 'I am here!'
  //     });
  //     this.markers.push(marker);
  //     this.map.setCenter(pos);
  //     this.loadingimg.dismiss();
  //
  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //     this.loading.dismiss();
  //   });
  // }
  //
  // updateSearchResults(){
  //   if (this.autocomplete.input == '') {
  //     this.autocompleteItems = [];
  //     return;
  //   }
  //   this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
  //     (predictions, status) => {
  //       this.autocompleteItems = [];
  //       if(predictions){
  //         this.zone.run(() => {
  //           predictions.forEach((prediction) => {
  //             this.autocompleteItems.push(prediction);
  //           });
  //         });
  //       }
  //   });
  // }
  //
  // selectSearchResult(item){
  //   this.clearMarkers();
  //   this.autocompleteItems = [];
  //
  //   this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
  //     if(status === 'OK' && results[0]){
  //       // let position = {
  //       //     lat: results[0].geometry.location.lat,
  //       //     lng: results[0].geometry.location.lng
  //       // };
  //       let marker = new google.maps.Marker({
  //         position: results[0].geometry.location,
  //         map: this.map
  //       });
  //       this.markers.push(marker);
  //       this.map.setCenter(results[0].geometry.location);
  //     }
  //   })
  // }
  //
  // clearMarkers(){
  //   for (var i = 0; i < this.markers.length; i++) {
  //     console.log(this.markers[i])
  //     this.markers[i].setMap(null);
  //   }
  //   this.markers = [];
  // }
  // /////////////////////////////first page ///////////////////////
  // addMarker(){
  //
  //     let marker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: this.map.getCenter()
  //
  //     });
  //     marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
  //
  //
  //     let content = "<p>This is your current position !</p>";
  //     let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //     });
  //
  //     google.maps.event.addListener(marker, 'click', () => {
  //     infoWindow.open(this.map, marker);
  //     });
  //
  // }
  //
  //
  // getRestaurants(latLng){
  //     var service = new google.maps.places.PlacesService(this.map);
  //     var request = {
  //         location : latLng,
  //         radius : 800 ,
  //         types: [this.searchFor],
  //         center: latLng,
  //         disableDefaultUI: true
  //     };
  //     return new Promise((resolve,reject)=>{
  //         service.nearbySearch(request,function(results,status){
  //             if(status === google.maps.places.PlacesServiceStatus.OK)
  //             {
  //                 resolve(results);
  //             }else
  //             {
  //                 reject(status);
  //             }
  //
  //         });
  //     });
  //
  // }
  // showConnect() {
  //   this.showMe = false;
  // }
  // createMarker(place){
  //     let marker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: place.geometry.location
  //     });
  //     marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
  //     marker.addListener('click', () => {
  //       //this.someProperty = Math.random();
  //         marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
  //         this.showConnect();
  //     });
  // }
  // addMap(lat,long){
  //
  //     let latLng = new google.maps.LatLng(lat, long);
  //
  //     let mapOptions = {
  //     center: latLng,
  //     zoom: 14,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //     disableDefaultUI: true
  //     }
  //
  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //     // this.map = new google.maps.Map(  document.getElementById('map'), mapOptions);////to append the locations
  //     this.map.addListener('click', (e)=> {
  //        // this.map.Marker.remove();
  //        this.locationSelected = JSON.stringify(e.latLng);
  //       this.selectlocation(e.latLng);
  //       // alert(this.locationSelected);
  //    });
  //
  //
  //
  //     this.getRestaurants(latLng).then((results : Array<any>)=>{
  //         this.places = results;
  //         for(let i = 0 ;i < results.length ; i++)
  //         {
  //           // if(this.searchFor != " "){
  //             this.createMarker(results[i]);
  //          }
  //     },(status)=>console.log(status));
  //
  //     this.addMarker();
  //
  // }
  //
  // getUserPosition(){
  //   console.log("getting user position");
  //     this.options = {
  //     enableHighAccuracy : true
  //     };
  //     this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
  //
  //         this.currentPos = pos;
  //
  //         console.log(pos);
  //         this.addMap(pos.coords.latitude,pos.coords.longitude);
  //
  //     },(err : PositionError)=>{
  //         console.log("error : " + err.message);
  //     ;
  //     })
  // }


}

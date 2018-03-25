import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfiledashboardPage } from '../../pages/profiledashboard/profiledashboard';

/**
 * Generated class for the ConnectionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-connections',
  templateUrl: 'connections.html',
})
export class ConnectionsPage {
  connections:any;
  connectionStatus:any = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnectionsPage');
      this.connections =[
                        {"name": "WhatsApp", "id" :"+91 -9876543210" , "status" : true },
                        {"name": "Facebook", "id" :"someone@facebook.com.com" , "status" : true },
                        {"name": "Skype", "id" :"someone@skype.com" , "status" : false },
                        {"name": "Google hangouts", "id" :"someone@google.com" , "status" : true }
                      ];

  }
  pageredirection(){
    this.navCtrl.push(ProfiledashboardPage);
    // alert(JSON.stringify(this.connections));
  }

}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
  AngularFireModule],
  providers: [ImagePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SocialSharing, CallNumber],
  bootstrap: [AppComponent],
})
export class AppModule {}
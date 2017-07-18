import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule,JsonpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import {MdButtonModule,MdInputModule, MdCheckboxModule,MdSidenavModule,MdMenuModule,MdChipsModule,MdProgressBarModule,MdTabsModule} from '@angular/material';
import 'hammerjs';
// import { AgmCoreModule } from '@agm/core';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { ServiceAppRoutingModule } from './app-routing.module';
// service
import { serivceModul } from './service/';
//pipe
import { ParkTablePipe } from './pages/haus-park/pipe';

import { AppComponent } from './app.component';
import { SliderComponent } from './share/slider';
import { HomeComponent , DialogContent } from './pages/home';
import { HausTableComponent , HausParkComponent , HausMapComponent , DirectionsMapDirective , SideMapComponent , JsonPolyLineDirective} from './pages/haus-park';

@NgModule({
  declarations: [
    AppComponent,
    DialogContent,
    SliderComponent,
    HomeComponent,
    HausParkComponent,
    HausMapComponent,
    DirectionsMapDirective,
    SideMapComponent,
    JsonPolyLineDirective,
    HausTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MdButtonModule, MdCheckboxModule,MdSidenavModule,MdChipsModule,MdInputModule,MdProgressBarModule,MdMenuModule,MdTabsModule,
    ServiceAppRoutingModule,
    ParkTablePipe,
    serivceModul,
    JsonpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDI4N7QdySwfP8aO0oWipZPbGKJHGAUI_M'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

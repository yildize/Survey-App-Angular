import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import { AngularFireModule } from '@angular/fire'
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore'
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatSortModule} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { YaratComponent } from './yarat/yarat.component';
import { KatilComponent } from './katil/katil.component';
import {MatRadioModule} from '@angular/material/radio';
import { GorComponent } from './gor/gor.component';

@NgModule({
  declarations: [
    AppComponent,
    YaratComponent,
    KatilComponent,
    GorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTableModule,
    MatDividerModule,
    MatListModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

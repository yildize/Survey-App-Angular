import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'meltemSurvey';

  constructor(private router:Router) { }

  getRoute(){
    return this.router.url;
  }
}

import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
declare function customInitFuntions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(private settingsService:SettingsService) { }

  ngOnInit(): void {
    //href="./assets/css/colors/default-dark.css"
    customInitFuntions();
  }

}

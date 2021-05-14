import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';
declare function customInitFuntions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(private settingsService:SettingsService, private sidebarService:SidebarService) { }

  ngOnInit(): void {
    //href="./assets/css/colors/default-dark.css"
    customInitFuntions();
    this.sidebarService.cargarMenu();
  }

}

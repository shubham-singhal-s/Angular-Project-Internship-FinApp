import { Component, OnInit, Inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from '../services/app.service';
import { HttpService } from '../services/http.service';
import { LoginService } from '../services/login.service';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {


  constructor(
    private appService: AppService,
    private httpService: HttpService,
    private login: LoginService, @Inject(LOCAL_STORAGE) private storage: StorageService) {
    
  }

  reload=false;

  ngOnInit() {
    //var a = this.storage.get("log");
    this.appService.initJQ();
    this.appService.initChartDashBoard();




  }

}



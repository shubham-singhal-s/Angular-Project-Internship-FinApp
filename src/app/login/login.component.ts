import { Component, OnInit } from '@angular/core';
import {LoginService} from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  compNames=[
    "5paisa",
    "adroit",
    "hedge"
  ];

  apiNames=[
    "5PaisaPortfolio",
    "AdroitPortfolio",
    "HedgePortfolio"
  ];

  constructor(private loginService:LoginService) { }
  
  ngOnInit() { 

  }

  onLogin(loginData) {
    
    var strEmail = loginData.txtUser;
    var strPass = loginData.txtPass;
    var intIndex = this.compNames.indexOf(loginData.txtComp.toLowerCase().replace(/ /g,''));
    if(intIndex==-1){
      this.loginService.loginStatus='Company does not exist!'
    }
    else{
      this.loginService.login(strEmail,strPass,this.apiNames[intIndex]);
    }
    
  }


}
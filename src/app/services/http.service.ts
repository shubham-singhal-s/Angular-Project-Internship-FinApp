import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { LoginService } from '../services/login.service';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  data:any;
  constructor(private http:HttpClient,private login:LoginService) { }

    getData<T>(url){
      //url+=this.login.portfolioId;
      var header=new HttpHeaders().set("ConnKey",this.login.headers);
      return this.http.get<T>(url,{headers:header});
    }
   
}
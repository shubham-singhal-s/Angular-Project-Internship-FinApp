import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import {catchError} from 'rxjs/operators';
import {timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  returnUrl: string;
  loggedIn = false;
  userData:userData;
  loginUrl =  "http://192.168.177.209:5000/Portfolio.svc/ValidateLogin/";
  headers:string;
  loginStatus:string;
  portfolioId:string;


  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService, private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {}

  getInfo(): boolean {
    this.loggedIn = this.storage.get("loggedIn");
    this.userData=this.storage.get("userData");
    this.portfolioId=this.storage.get("portfolioId");
    this.headers=this.storage.get("headers");

    console.log(this.portfolioId);
    return this.loggedIn;
  }

  invalidateSession(){
    var obsTimer = timer(1200000);
    obsTimer.subscribe(data => {
      alert('Session Expired');
      this.removeSession();
      this.router.navigate(['login']);
    })
  }

  removeSession(){
    this.loggedIn=false;
    var tempData:userData
    this.userData=tempData;
    this.headers='';
    this.storage.remove("loggedIn");
    this.storage.remove("userName");
    this.storage.remove("userData");
    this.storage.remove("headers");
    this.storage.remove("portfolioId");

  }


  login(email: string, pass: string, company: string) {
    this.loginStatus='';
    
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    var httpOptions = {
      headers: new HttpHeaders({
        'ConnKey': company
      })
    };

    var url = this.loginUrl + email + '/' + pass;

    this.http.get<any>(url, httpOptions)
    .pipe(
    catchError(err => {
      this.loginStatus="Error encountered, please contact admin";
      throw err;
    }))
    .subscribe(data => {
      if (data.head['status-description'] === 'success') {
        this.userData = data.Message[0];
        this.loggedIn = true;
        this.headers=company;
        this.portfolioId='1';
        this.storage.set("loggedIn", true);
        this.storage.set("userName", email);
        this.storage.set("portfolioId",this.portfolioId);
        this.storage.set("userData", this.userData);
        this.storage.set("headers",company);
        this.router.navigate([this.returnUrl]); 
      }
      else{
        //alert("These details don't exist on the specified company!");
        this.loginStatus="Wrong user/pass for this company";
      }
    })
  }

  logout(){
    this.removeSession();
    this.router.navigate(['login']);
  }

}

interface userData{
    FirstLogin:string,
    PAN:string,
    UserId:string,
    UserName:string
}

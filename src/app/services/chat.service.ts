import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseURL: string = "https://api.dialogflow.com/v1/query?v=20150910";
  //private token: string = "ed14ecd135fe482a9c333d06d2281048";
  private token: string = "c97ce31d65554e078d4dce0d18eafa5f";

  constructor(private http: HttpClient) { }

  public getResponse(query: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + this.token
      })
    };
    console.log(query);
    let data = {
      query: query,
      lang: 'en',
      sessionId: 'KL1000001:1'
    };
    return this.http
      .post(`${this.baseURL}`, data, httpOptions);
  }

}

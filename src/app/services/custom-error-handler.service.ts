import { Injectable,Inject } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { saveAs } from 'file-saver';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
@Injectable()
export class CustomErrorHandler extends ErrorHandler {
  constructor(private logger: NGXLogger,@Inject(LOCAL_STORAGE) private storage: StorageService) {
    super();
  }
  errorJSON:any=[];
    handleError(error) {
    //super.handleError(error);
    console.log('helllloooooo');
    var err = error;
    this.logger.log(err);
    this.saveLogFile(JSON.stringify(error));
    var temp = this.storage.get("log");
    if(temp!=null){
      this.errorJSON=temp;
    }
   
    //this.errorJSON.push(temp);
    this.errorJSON.push(err);
    this.storage.set("log",this.errorJSON);
    //console.log(error);
    //alert('Error occurred');
    // console.log("heloooooooooooooooooooooooo");
    // console.log(this.errorJSON);
  }
  saveLogFile(log): void {
    //saveAs(new Blob([log], { type: "text" }), 'data.log');
  }
}

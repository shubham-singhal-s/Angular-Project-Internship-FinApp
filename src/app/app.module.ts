//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { StorageServiceModule } from 'angular-webstorage-service';
import { HttpClientModule } from '@angular/common/http';
//Components
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
//Services
import { LoginService } from './services/login.service';
import { AppService } from './services/app.service';
import { ChatService } from './services/chat.service';
import { HttpService } from './services/http.service';
//Pipes
import {ColorPipe} from './pipes/color.pipe';
import {ToStr} from './pipes/round_str.pipe';
//Functionality
import { ROUTING } from './app.routing';
import { AuthGuard } from './Auth/auth.guard';
import { APP_BASE_HREF } from '@angular/common';
import { NGXLogger, LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from './../environments/environment';
import {CustomErrorHandler} from './services/custom-error-handler.service'
import 'jquery';
import { WatchListComponent } from './watch-list/watch-list.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    LoginComponent,
    ErrorComponent,
    ColorPipe,
    ToStr,
    WatchListComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    BrowserModule,
    AmChartsModule,
    ROUTING,
    FormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    StorageServiceModule,
    LoggerModule.forRoot({
      level: environment.envName === 'prod' ? NgxLoggerLevel.LOG :

        environment.envName === 'dev' ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.INFO,

      serverLogLevel: NgxLoggerLevel.OFF
    }),

  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    AppService,
    AuthGuard,
    LoginService,
    ChatService,
    HttpService,
    ToStr,
    ColorPipe,
    {
      provide:ErrorHandler,
      useClass:CustomErrorHandler 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private logger:NGXLogger){
    this.showEnvironment();
  }
  showEnvironment(){
    this.logger.warn('Environment : '+environment.envName);
  }

 }

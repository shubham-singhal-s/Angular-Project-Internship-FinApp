import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ChatService } from '../services/chat.service';
import { HttpService } from '../services/http.service';
import { AppService } from '../services/app.service';
import { Data_Interface } from '../datajson';
import SpeechToText from 'speech-to-text';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],

})
export class MainComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.appService.hideSideNav(event.target.innerWidth);
  }

  str: string;
  txtInputChat: string;
  sensexValue: number;
  niftyValue: number;
  arr = [];
  @ViewChild('dropSensex') sensex: any;
  @ViewChild('dropNifty') nifty: any;
  @ViewChild('dropAord') aord: any;
  @ViewChild('dropRemind') remind: any;
  @ViewChild('dropNotif') notif: any;
  @ViewChild('dropSearch') search: any;
  @ViewChild('dropUser') user: any;

  Messages: botMessage[] = [];

  constructor(private ref: ChangeDetectorRef, private login: LoginService, private chatService: ChatService, private httpService: HttpService, private appService: AppService) {
  }

  showChat: boolean = false;
  arrow = 'fa-angle-up';
  classMic = "fa fa-microphone-slash micDisable";
  micClass = ["fa fa-microphone-slash micDisable", "fa fa-microphone micEnable"];

  networth: number;
  boxData: any;
  messageData1;
  cvalue;
  invest;
  daysGain;
  total: number;
  realized;
  unrealized;
  stocksCurrentValue: number;
  stocksTodaysChange: number;
  mfCurrentValue: number;
  mfTodaysChange: number;

  mfValue: number;

  speakerEnable = true;
  synth = window.speechSynthesis;

  speak(text) {

    if (this.speakerEnable) {

      var u = new SpeechSynthesisUtterance();
      u.text = text;
      u.lang = 'hi-IN';
      speechSynthesis.speak(u);
      this.synth.resume();
    }
  }

  speakBreak(str) {
    this.synth.cancel();
    var re = /<br>/gi;
    if (str.length>190) {
      var strArr = str.split('<br>');
      strArr.forEach(item => {
        this.speak(item);
      })
    }
    else {
      var newstr = str.replace(re, ". ");
      this.speak(newstr);
    }

  }

  toggleSpeak() {
    this.speakerEnable = !this.speakerEnable;
    if (!this.speakerEnable) {
      this.synth.cancel();
    }
  }

  ngOnInit() {
    this.login.getInfo();
    this.arr.push(this.sensex);
    this.arr.push(this.nifty);
    this.arr.push(this.aord);
    this.arr.push(this.remind);
    this.arr.push(this.notif);
    this.arr.push(this.user);
    this.arr.push(this.search);
    this.appService.hideSideNav(window.screen.width);
    this.appService.hideSideNav(window.innerWidth);
    this.login.invalidateSession();

    this.httpService.getData<any>(this.appService.domainUrl + this.appService.domainService + 'GetSensexDetails/' + this.login.userData.UserId + '/' + this.login.portfolioId).subscribe(data => {
      console.log("Sensex");
      console.log(data);
      this.assignStockData(data);
    });
    this.httpService.getData<Data_Interface>(this.appService.domainUrl + this.appService.domainService + 'MyNetWorth/' + this.login.userData.UserId + '/' + this.login.portfolioId).subscribe(data => {

      this.networth = data.Message[0].AssetNetworth;
      this.networth = Math.round(this.networth * 100) / 100;
    });
    this.httpService.getData<any>(this.appService.domainUrl + this.appService.domainService + 'PortfolioOverview/' + this.login.userData.UserId + '/' + this.login.portfolioId + '/All').subscribe(data => {

      this.messageData1 = data.Message;
      this.boxData = this.appService.fetchJson(this.messageData1, ["CurrentValue", "InvestmentAmount", "DayGainLoss", "RealisedGain", "UnrealisedGain"]);
      this.cvalue = this.boxData[0].CurrentValue
      this.invest = this.boxData[0].InvestmentAmount;
      this.daysGain = this.boxData[0].DayGainLoss;
      this.realized = this.boxData[0].RealisedGain;
      this.unrealized = this.boxData[0].UnrealisedGain;
      this.total = this.unrealized + this.realized;

    });
    this.httpService.getData<any>(this.appService.domainUrl + this.appService.domainService + 'GetPortfolioSummaryDetail/' + this.login.userData.UserId + '/' + this.login.portfolioId).subscribe(data => {

      this.stocksCurrentValue = data.Message[0].currentvalue;
      this.stocksCurrentValue = Math.round(this.stocksCurrentValue * 100) / 100;
      this.stocksTodaysChange = data.Message[0].DayChange;
      this.stocksTodaysChange = Math.round(this.stocksTodaysChange * 100) / 100;
      this.mfCurrentValue = data.Message[1].currentvalue;
      this.mfCurrentValue = Math.round(this.mfCurrentValue * 100) / 100;
      this.mfTodaysChange = data.Message[1].DayChange;
      this.mfTodaysChange = Math.round(this.mfTodaysChange * 100) / 100;

    });
    this.ref.detectChanges();
  }
  assignStockData(data: any) {
    this.sensexValue = data.Message[0].CurrentValue;
    this.sensexValue = Math.round(this.sensexValue * 100) / 100;
    this.niftyValue = data.Message[1].CurrentValue;
    this.niftyValue = Math.round(this.niftyValue * 100) / 100;
  }

  logout() {
    this.login.logout();
  }

  close(num: number) {
    this.showChat = false;
    this.arrow = 'fa-angle-up';
    for (var i = 0; i < this.arr.length; i++) {
      if (i == num) {
        continue;
      }
      this.arr[i].hide();
    }

  }

  toggleChat() {
    this.showChat = !this.showChat;
    if (this.showChat) {
      this.arrow = 'fa-angle-down';
    }
    else {
      this.arrow = 'fa-angle-up';
    }
  }

  pushMessage(user: string, body: string) {
    console.log('pushed');
    var msgTemplate: botMessage = {
      user: '',
      body: ''
    };
    console.log(body);
    msgTemplate.user = user;
    msgTemplate.body = body;
    this.Messages.push(msgTemplate);
    this.Messages = [...this.Messages];
    this.ref.detectChanges();
    //this.txtInputChat='';
  }

  sendChat(chatString: string) {

    if (chatString !== '') {

      //Add user message
      this.pushMessage('me', chatString);

      //Get chat response and add it
      var chatResponse;
      this.chatService.getResponse(chatString).subscribe(data => {
        chatResponse = data.result.fulfillment.speech;
        this.speakBreak(chatResponse);
        this.pushMessage('bot', chatResponse);
      })
    }
  }

  refresh() {
    location.reload();
  }

  //Initialize Listener
  txtChat1: any;
  onAnythingSaid = text => {
    this.txtInputChat = text;
    this.ref.detectChanges();
  };
  onFinalised = text => {
    console.log(`Finalised text: ${text}`);
    this.sendChat(text);
    this.txtInputChat = '';
    this.listener.stopListening();
    this.classMic = this.micClass[0];
    this.listening = false;
  };
  listener = new SpeechToText(this.onAnythingSaid, this.onFinalised);
  listening = false;

  //listen
  listenSpeech() {

    if (this.listening) {
      this.classMic = this.micClass[0];
      this.listening = false;
      this.listener.stopListening();
    }
    else {
      this.classMic = this.micClass[1];
      try {
        console.log('listening');
        this.listening = true;
        this.listener.startListening();
      } catch (error) {
        console.log(error);
      }
    }


  }


}

interface botMessage {
  user: string;
  body: string;
}

import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { HttpService } from '../services/http.service';
import { LoginService } from '../services/login.service';
import { ToStr } from '../pipes/round_str.pipe';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getElement } from '@amcharts/amcharts4/core';


@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css']
})
export class WatchListComponent implements OnInit {

  constructor(private tostr: ToStr, private appService: AppService, private httpService: HttpService, private login: LoginService) {

  }
  message: any[] = [];
  txtFilter: string;
  p: number = 1;

  boolSort = false;

  sortTable(cmpName) {
    this.boolSort = !this.boolSort;
    if (this.boolSort) {
      this.message.sort(this.predicateBy(cmpName));
    }
    else {
      this.message.sort(this.predicateByRev(cmpName));
    }
  }

  predicateBy(prop) {
    return function (a, b) {
      var x, y;
      if (typeof a[prop] === 'string') {
        x = a[prop].toLowerCase();
        y = b[prop].toLowerCase();
      }
      else {
        x = a[prop];
        y = b[prop];
      }
      if (x > y) {
        return 1;
      } else if (x < y) {
        return -1;
      }
      return 0;
    }
  }

  predicateByRev(prop) {
    return function (a, b) {
      var x, y;
      if (typeof a[prop] === 'string') {
        x = a[prop].toLowerCase();
        y = b[prop].toLowerCase();
      }
      else {
        x = a[prop];
        y = b[prop];
      }
      if (x > y) {
        return -1;
      } else if (x < y) {
        return 1;
      }
      return 0;
    }
  }


  //excell file 
  toExcel() {
    var arrData = this.message;
    var CSV = '';

    //This condition will generate the Label/Header
    var row = "";
    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {
      //Now convert each value to string and comma-seprated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    CSV += row + '\r\n';


    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      row = "";
      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
        row += '"' + arrData[i][index] + '",';
      }
      row.slice(0, row.length - 1);
      //add a line break after each row
      CSV += row + '\r\n';
    }

    var fileName = "Equity";
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.download = fileName + ".csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toPDF() {
    var columns = [];
    var rows = [];
    for (var index in this.message[0]) {
      //Now convert each value to string and comma-seprated
      columns.push(index);
    }
    this.message.forEach(item => {

      var arr = Object.values(item);
      rows.push(arr);
    })


    var doc = new jsPDF('landscape');
    doc.autoTable(columns, rows, {
      styles: {
        overflow: 'linebreak',
        halign: 'center',
        fontSize: 8
      }
    });
    doc.save('table.pdf');
  }



  ngOnInit() {

    this.appService.initJQ();


    this.httpService.getData<any>(this.appService.domainUrl + this.appService.domainService + 'EquityHoldingSummary/' + this.login.userData.UserId + '/' + this.login.portfolioId + '/H').subscribe(data => {
      console.log("table data");
      data.Message.forEach(item => {
        item.total = item.realised + item.unrealised;
        delete item['SecurityCode'];
        delete item['PortfolioId'];
        delete item['DayGainArrow'];
        delete item['PrevClose'];
        delete item['RealisedArrow'];
        delete item['UnrealisedArrow'];
        delete item['companycode'];
        delete item['companycode'];
        item.companyname = item.companyname.trim();
        item.averageprice = this.round(item.averageprice);
        item.averagevalue = this.round(item.averagevalue);
        item.latestprice = this.round(item.latestprice);
        item.currentvalue = this.round(item.currentvalue);
        item.realised = this.round(item.realised);
        item.unrealised = this.round(item.unrealised);
        item.total = this.round(item.total);
      })
      this.message = data.Message;
      console.log(this.message);
    });

  }
  addFilter(str) {
    this.txtFilter = str;
    console.log(str);
  }

  round(num) {
    return this.tostr.transform(num);
  }
}

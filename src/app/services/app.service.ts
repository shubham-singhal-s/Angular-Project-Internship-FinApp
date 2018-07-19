import { Injectable } from '@angular/core';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { HttpService } from '../services/http.service';
import { LoginService } from '../services/login.service';
import { ToStr } from '../pipes/round_str.pipe';
import * as _ from "lodash";
import * as am4core from "@amcharts/amcharts4/core";

import * as am4charts from "@amcharts/amcharts4/charts";


declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {

  domainUrl = "http://192.168.177.209:5000/";
  domainService = "Portfolio.svc/";
  sectors: any;
  pieData: any;
  dataProvider;
  messageData;
  treeMapData: any;
  c = 0;
  color = ["#003cb3", "#cc00cc", "#99cc00"];
  constructor(
    private AmCharts: AmChartsService,
    private httpService: HttpService,
    private login: LoginService,
    private strPipe: ToStr

  ) { }

  treeMapChart(data: any) {
    this.treeMapData = this.createJson1(data);
    this.treeMap();
  }
  createJson1(data: any) {
    var currAsset = "";
    var jsonNew = [];
    var item = {};
    var childAttr = {};
    var child: any = [];
    for (var i = 0; i < data.length; i++) {
      if (currAsset !== data[i].AssetName) {
        currAsset = data[i].AssetName;
        if (i == 0) {
          item["name"] = currAsset;
          childAttr["name"] = data[i].SecurityCode;
          childAttr["value"] = data[i].averageValue;
          let childClone = _.cloneDeep(childAttr);
          child.push(childClone);
        }
        else if (i != 0) {
          item["children"] = child;
          //new
          item["color"] = this.color[this.c];
          this.c = this.c + 1;
          let itemClone = _.cloneDeep(item);
          jsonNew.push(itemClone);
          child = [];
          item = {};
          item["name"] = currAsset;
          childAttr["name"] = data[i].SecurityCode;
          childAttr["value"] = data[i].averageValue;
          let childClone = _.cloneDeep(childAttr);
          child.push(childClone);
          if (data.length - 1 == i) {
            let childClone = _.cloneDeep(childAttr);
            child.push(childClone);
            item["children"] = child;
            item["color"] = this.color[this.c];
            this.c = this.c + 1;
            let itemClone = _.cloneDeep(item);
            jsonNew.push(itemClone);
          }
        }
      }
      else {
        var name = data[i].SecurityCode;
        var value = data[i].averageValue;
        childAttr["name"] = name;
        childAttr["value"] = value;
        let childAttrClone = _.cloneDeep(childAttr)
        child.push(childAttrClone);

      }

    }
    return jsonNew;
  }
  roundOff(val) {
    return (Math.round(val));
  }
  treeMap() {

    let treeChart = am4core.create("chartdiv10", am4charts.TreeMap);

    treeChart.padding(0, 0, 0, 0);

    treeChart.data = this.treeMapData;

    treeChart.maxLevels = 1;

    treeChart.colors.step = 20;



    // level 1

    var level1 = treeChart.seriesTemplates.create("0");



    let level1_bullet = level1.bullets.push(new am4charts.LabelBullet());

    level1_bullet.locationY = 0.5;

    level1_bullet.locationX = 0.5;

    level1_bullet.label.text = "{name}";

    level1_bullet.label.fill = am4core.color("#fff");

    level1_bullet.label.fontSize = 50;

    level1.bulletsContainer.hiddenState.properties.opacity = 0;

    level1.bulletsContainer.hiddenState.properties.visible = false;

    level1.strokeWidth = 2;


    //level1_bullet.label.textDecoration.fontcolor("#ffe6e6");

    // hoverState.adapter.add("fill", (fill, target) => {

    // return am4core.color(am4core.colors.brighten(fill.rgb, -0.2));

    // });
    level1_bullet.fillOpacity = 0.3;

    treeChart.navigationBar = new am4charts.NavigationBar();



    //level2

    var level1SeriesTemplate = treeChart.seriesTemplates.create("1");

    var bullet1 = level1SeriesTemplate.bullets.push(

      new am4charts.LabelBullet()

    );

    bullet1.locationX = 0.5;

    bullet1.locationY = 0.5;

    bullet1.label.text = "{name}";

    bullet1.label.fill = am4core.color("#ffffff");

    level1SeriesTemplate.columns.template.fillOpacity = 0;
    bullet1.label.fontSize = 15;




    //level3 

    var level2SeriesTemplate = treeChart.seriesTemplates.create("2");

    var bullet2 = level2SeriesTemplate.bullets.push(

      new am4charts.LabelBullet()

    );

    bullet2.locationX = 0.5;

    bullet2.locationY = 0.5;

    bullet2.label.text = "{name}";

    bullet2.label.fill = am4core.color("#ffffff");





    treeChart.dataFields.value = "value";

    treeChart.dataFields.name = "name";

    treeChart.dataFields.children = "children";

    treeChart.dataFields.color = "color";

  }


  initJQ() {
    //new

    $(".search_btn").click(function () {
      $('.search_body').slideToggle(300);
      $('.search_body input').focus();
    });


    if ($(window).width() < 768) {
      $(".sutable tr td").hide();
      $(".sutable tr").find("td:nth-child(3)").addClass("frst");
      $(".frst").click(function () {
        $(this).nextAll('.hide_td').slideToggle(300);
        $(this).toggleClass('activearw');
        $('.frst').not(this).nextAll('.hide_td').slideUp(300)
        $('.frst').not(this).removeClass('activearw')
      });
    }

    $(".Myportfolio_summary").hide();
    $(".Profit_N_loss").click(function () {
      $(this).fadeOut();
      $(".Myportfolio_summary").fadeIn();
      $(".dummychart2").slideDown(300);
      $(".dummychart1").slideUp(300);
    });
    $(".Myportfolio_summary").click(function () {
      $(this).fadeOut();
      $(".Profit_N_loss").fadeIn();
      $(".dummychart1").slideDown(300);
      $(".dummychart2").slideUp(300);
    });


    $('.edit_btn').click(function () {
      $(this).next().fadeToggle('fast');
      $(this).find('i').toggleClass('fa-pencil fa-times')
      $('.edit_btn').not(this).next().fadeOut();
      $('.edit_btn').not(this).find('i').addClass('fa-pencil')
    });

    // by darshan on 21 june 2018
    $(".lft_hdngs").find("a").click(function () {
      var parnt = $(this).parent().parent();
      //var chld=parnt.next(".fst_info").html();
      $(".lft_hdngs").find("a").not(this).parents(".lft_hdngs").next(".fst_info").removeClass("hide_me").addClass("showw_me");

      $(this).parents(".lft_hdngs").next(".fst_info").toggleClass("showw_me hide_me");

    })

    $(".xchng_btn").click(function () {
      $(this).hide().removeClass("active");
      $(".xchng_btn").not(this).show().addClass("active");
    })

    $('.grid-stack').gridstack({
      width: 12
    });
    $(".accordion-toggle").click(function () {
      $(this).toggleClass("activu");
      $(".accordion-toggle").not(this).removeClass("activu");
    })
    var options = {
      float: true
    };
    $('.grid-stack').gridstack(options);
    console.log('1');

    new function () {
      this.items = [
        { x: 0, y: 0, width: 2, height: 2 },
      ];

      this.grid = $('.grid-stack').data('gridstack');
      console.log('2');
      this.addNewWidget = function () {
        var node = this.items.pop() || {
          x: 12 * Math.random(),
          y: 5 * Math.random(),
          width: 1 + 3 * Math.random(),
          height: 1 + 3 * Math.random()
        };
        this.grid.addWidget($('<div><div class="grid-stack-item-content" /><div/>'),
          node.x, node.y, node.width, node.height);
        return false;
      }.bind(this);

      $('#add-new-widget').click(this.addNewWidget);
    };






    $(document).ready(function () {

      $('.progress .progress-bar').css("width",
        function () {
          return $(this).attr("aria-valuenow") + "%";
        })
      /*jquery for animated progressbars end*/

      $('select:not(.ignore)').niceSelect();
      $('.gadgets-btn').click(function () {
        $('.gadgets-cont').slideToggle();
        $('.gadgets-btn').toggleClass('active');
      });


      $('a[href="#"]').click(function (e) {
        e.preventDefault();
      });
    });

    $('.portfolio_slide').owlCarousel({
      loop: false,
      dots: false,
      smartSpeed: 450,
      margin: 10,
      nav: true,
      items: 1
    });

    $('#mob_ticker').owlCarousel({
      loop: true,
      dots: false,
      autoplay: true,
      autoplayTimeout: 3000,
      smartSpeed: 450,
      nav: false,
      items: 1
    });

    /* mobile ticker */
    $('#mob_ticker2').owlCarousel({
      loop: true,
      dots: false,
      autoplay: true,
      autoplayTimeout: 5000,
      smartSpeed: 450,
      nav: false,
      margin: 20,
      items: 2
    });

    if (window.screen.width < 992) {

      //this.hideSideNav(window.screen.width);
      //$(".side_nav_btn").trigger('click');


      $(".side_nav_btn").click(function () {
        this.hideSideNav();
      });

      $(".main_nav").click(function () {
        $(".navbar-nav").slideToggle().toggleClass("nav-active");
      });

    }
  }

  initChartDashBoard() {
    this.httpService.getData<any>(this.domainUrl + this.domainService + 'SectorAllocation/' + this.login.userData.UserId + '/' + this.login.portfolioId).subscribe(data => {

      this.sectors = data.Message;
      this.pieData = this.fetchJson(this.sectors, ["sector", "Weightage", "Value"]);


      //Round off values
      this.pieData.forEach(
        val => {
          val.Weightage = Math.round(val.Weightage * 100) / 100;
          val.Value1 = this.strPipe.transform(val.Value);
        });

      this.pieChart();
    });

    this.httpService.getData<any>(this.domainUrl + this.domainService + 'GetPortfolioSummaryDetail/' + this.login.userData.UserId + '/' + this.login.portfolioId).subscribe(data => {

      this.messageData = data.Message;
      this.dataProvider = this.fetchJson(this.messageData, ["Segment", "currentvalue", "Change", "DayChange", "investmentamount"]);
      //["Segment", "currentvalue", "Change", "PerChange", "DayChange", "investmentamount", "realised", "perrealised", "DayPerChange", "TotalAmount"]
      this.dataProvider.forEach(
        val => {
          val.Change = this.roundOff(val.Change);
          val.DayChange = this.roundOff(val.DayChange);
          val.DayPerChange = this.roundOff(val.DayPerChange);
          val.PerChange = this.roundOff(val.PerChange);
          val.currentvalue = this.roundOff(val.currentvalue);
          val.TotalAmount = this.roundOff(val.TotalAmount);
          val.investmentamount = this.roundOff(val.investmentamount);
          val.perrealised = this.roundOff(val.perrealised);
          val.realised = this.roundOff(val.realised);
        });
      this.chart();
    });
    this.httpService.getData<any>(this.domainUrl + this.domainService + 'AssetAllocation/' + this.login.userData.UserId + '/' + this.login.portfolioId + '/1').subscribe(data => {

      this.treeMapData = data.Message;
      this.treeMapChart(this.treeMapData);
      //

    });



    // Amchart Profit N Loss
    this.AmCharts.makeChart("chartdiv2",
      {
        "type": "serial",
        "categoryField": "category",
        "plotAreaBorderColor": "#008CDC",
        "startDuration": 1,
        "backgroundColor": "#2A4659",
        "fontFamily": "CALIBRI",
        "fontSize": 16,
        "theme": "black",
        "categoryAxis": {
          "gridPosition": "start"
        },
        "trendLines": [],
        "graphs": [
          {
            "balloonText": "[[title]] of [[category]]:[[value]]",
            "bullet": "round",
            "id": "AmGraph-1",
            "lineColor": "#00CDFF",
            "lineThickness": 2,
            "title": "INVESTMENT",
            "type": "smoothedLine",
            "valueField": "column-1"
          },
          {
            "balloonText": "[[title]] of [[category]]:[[value]]",
            "bullet": "square",
            "id": "AmGraph-2",
            "lineColor": "#00A616",
            "lineThickness": 3,
            "title": "CURRENT VALUE",
            "type": "smoothedLine",
            "valueField": "column-2"
          }
        ],
        "guides": [],
        "valueAxes": [
          {
            "id": "ValueAxis-1",
            "maximum": 100000,
            "position": "right",
            "precision": 0,
            "synchronizationMultiplier": 0,
            "labelOffset": 4,
            "title": "Axis title"
          }
        ],
        "allLabels": [],
        "balloon": {},
        "legend": {
          "enabled": true,
          "useGraphSettings": true
        },
        "titles": [
          {
            "id": "Title-1",
            "size": 15,
            "text": ""
          }
        ],
        "dataProvider": [
          {
            "category": "JAN",
            "column-1": "80000",
            "column-2": "50000"
          },
          {
            "category": "FEB",
            "column-1": "60000",
            "column-2": "70000"
          },
          {
            "category": "MAR",
            "column-1": "20000",
            "column-2": "30000"
          },
          {
            "category": "APR",
            "column-1": "10000",
            "column-2": "30000"
          },
          {
            "category": "MAY",
            "column-1": "20000",
            "column-2": "10000"
          },
          {
            "category": "JUN",
            "column-1": "30000",
            "column-2": "20000"
          },
          {
            "category": "JUL",
            "column-1": "60000",
            "column-2": "80000"
          },
          {
            "category": "AUG",
            "column-1": "70000",
            "column-2": "85000"
          },
          {
            "category": "SEP",
            "column-1": "50000",
            "column-2": "90000"
          },
          {
            "category": "OCT",
            "column-1": "80000",
            "column-2": "92000"
          },
          {
            "category": "NOV",
            "column-1": "82000",
            "column-2": "93000"
          },
          {
            "category": "DEC",
            "column-1": "85000",
            "column-2": "99000"
          }
        ]
      }
    );

    // Goal Performance chart
    this.AmCharts.makeChart("chartdiv3",
      {
        "type": "serial",
        "categoryField": "category",
        "plotAreaBorderColor": "#008CDC",
        "startDuration": 1,
        "backgroundColor": "#000000",
        "fontFamily": "CALIBRI",
        "fontSize": 16,
        "theme": "black",
        "categoryAxis": {
          "gridPosition": "start"
        },
        "trendLines": [],
        "graphs": [
          {
            "balloonText": "[[title]] of [[category]]:[[value]]",
            "bullet": "round",
            "id": "AmGraph-1",
            "lineColor": "#00CDFF",
            "lineThickness": 2,
            "title": "Child Education",
            "valueField": "column-1"
          },
          {
            "balloonText": "[[title]] of [[category]]:[[value]]",
            "bullet": "square",
            "id": "AmGraph-2",
            "lineColor": "#00A616",
            "lineThickness": 3,
            "title": "Buy Home",
            "valueField": "column-2"
          },
          {
            "bullet": "bubble",
            "bulletBorderThickness": 3,
            "bulletSize": 10,
            "id": "AmGraph-3",
            "lineColor": "#FF9D00",
            "lineThickness": 2,
            "title": "Children's Marriage",
            "valueField": "column-3"
          }
        ],
        "guides": [],
        "valueAxes": [
          {
            "id": "ValueAxis-1",
            "maximum": 100000,
            "precision": 0,
            "synchronizationMultiplier": 0,
            "labelOffset": 4,
            "title": "Networth (Lakh)"
          }
        ],
        "allLabels": [],
        "balloon": {},
        "legend": {
          "enabled": true,
          "marginLeft": 0,
          "marginRight": 0,
          "spacing": 0,
          "useGraphSettings": true,
          "valueAlign": "left",
          "valueWidth": 0
        },
        "titles": [
          {
            "id": "Title-1",
            "size": 15,
            "text": ""
          }
        ],
        "dataProvider": [
          {
            "category": "2015",
            "column-1": "80000",
            "column-2": "50000",
            "column-3": "16000"
          },
          {
            "category": "2016",
            "column-1": "60000",
            "column-2": "70000",
            "column-3": "15000"
          },
          {
            "category": "2017",
            "column-1": "20000",
            "column-2": "30000",
            "column-3": "20000"
          },
          {
            "category": "2018",
            "column-1": "10000",
            "column-2": "30000",
            "column-3": "24000"
          },
          {
            "category": "2019",
            "column-1": "20000",
            "column-2": "10000",
            "column-3": "30000"
          },
          {
            "category": "2020",
            "column-1": "30000",
            "column-2": "20000",
            "column-3": "32000"
          },
          {
            "category": "2021",
            "column-1": "60000",
            "column-2": "80000",
            "column-3": "35000"
          },
          {
            "category": "2022",
            "column-1": "70000",
            "column-2": "85000",
            "column-3": "40000"
          }
        ]
      }
    );

    // Portfolio Performance
    this.AmCharts.makeChart("chartdiv4",
      {
        "type": "serial",
        "categoryField": "category",
        "plotAreaBorderColor": "#008CDC",
        "startDuration": 1,
        "backgroundColor": "#000000",
        "fontFamily": "CALIBRI",
        "fontSize": 16,
        "theme": "black",
        "categoryAxis": {
          "gridPosition": "start"
        },
        "trendLines": [],
        "graphs": [
          {
            "balloonText": "[[title]] of [[category]]:[[value]]",
            "bullet": "round",
            "id": "AmGraph-1",
            "lineColor": "#00CDFF",
            "lineThickness": 2,
            "title": "My Investment",
            "valueField": "column-1"
          }
        ],
        "guides": [],
        "valueAxes": [
          {
            "id": "ValueAxis-1",
            "maximum": 100000,
            "precision": 0,
            "synchronizationMultiplier": 0,
            "labelOffset": 4,
            "title": "Investment Amount (INR)"
          }
        ],
        "allLabels": [],
        "balloon": {},
        "legend": {
          "enabled": true,
          "marginLeft": 0,
          "marginRight": 0,
          "spacing": 0,
          "useGraphSettings": true,
          "valueAlign": "left",
          "valueWidth": 0
        },
        "titles": [
          {
            "id": "Title-1",
            "size": 15,
            "text": ""
          }
        ],
        "dataProvider": [
          {
            "category": "Jan",
            "column-1": "80000"
          },
          {
            "category": "Feb",
            "column-1": "60000"
          },
          {
            "category": "Mar",
            "column-1": "20000"
          },
          {
            "category": "Apr",
            "column-1": "10000"
          },
          {
            "category": "May",
            "column-1": "60000"
          },
          {
            "category": "Jun",
            "column-1": "70000"
          }
        ]
      }
    );



  }

  fetchJson(data: any, attribute: string[]) {
    var jsonNew = [];
    for (var i = 0; i < data.length; i++) {
      var item = {}
      for (var attr of attribute) {
        item[attr] = data[i][attr];

      }

      jsonNew.push(item);
    }

    return jsonNew;
  }
  trim() {

  }
  pieChart() {
    this.AmCharts.makeChart("chartdiv5",
      {
        "hideCredits": true,
        "type": "pie",
        "balloonText": "[[title]]: [[Value1]]<br><span style='font-size:14px'> ([[percents]]%)</span>",
        "innerRadius": "80%",
        "labelRadius": 4,
        "labelText": "[[percents]]%",
        "minRadius": 13,
        "maxLabelWidth": 300,
        "outlineThickness": 0,
        "pullOutDuration": 1,
        "pullOutEffect": "easeOutSine",
        "startDuration": 1,
        "startEffect": "easeOutSine",
        "titleField": "sector",
        "valueField": "Weightage",
        "fontFamily": "Calibri",
        "fontSize": 16,
        "theme": "black",
        "allLabels": [],
        "balloon": {},
        "legend": {
          "enabled": true,
          "align": "center",
          "autoMargins": false,
          "labelWidth": 0,
          "left": 0,
          "marginBottom": 20,
          "marginLeft": 0,
          "marginRight": 0,
          "markerType": "circle",
          "maxColumns": 3,
          "right": 0,
          "spacing": 0,
          "tabIndex": 0,
          "top": 0,
          "valueAlign": "left",
          "valueText": "[[value]]%",
          "valueWidth": 15,
          "verticalGap": 0
        },
        "titles": [],
        "dataProvider": this.pieData
      }
    );

  }
  chart() {

    this.AmCharts.makeChart("chartdiv",
      {
        "type": "serial",
        "categoryField": "Segment",
        "columnSpacing": 4,
        "columnWidth": 0.29,
        "maxSelectedSeries": 7,
        "mouseWheelScrollEnabled": true,
        "mouseWheelZoomEnabled": true,
        "maxZoomFactor": 17,
        "zoomOutButtonImageSize": 14,
        "zoomOutButtonPadding": 3,
        "startDuration": 1,
        "startEffect": "easeOutSine",
        "fontFamily": "calibri",
        "fontSize": 16,
        //"backgroundColor": "#444444",
        "backgroundAlpha": 0.00,
        "theme": "black",
        "categoryAxis": {
          "autoWrap": true,
          "gridPosition": "start",
          "boldLabels": true,
          "labelOffset": -3
        },
        "chartCursor": {
          "enabled": true,
          "avoidBalloonOverlapping": false,
          "balloonPointerOrientation": " vertical",
          "bulletsEnabled": true,
          "oneBalloonOnly": true
        },

        "trendLines": [],
        "graphs": [
          {
            "balloonText": "[[title]] of [[category]]:[[value]]",
            "dashLength": 3,
            "fillAlphas": 1,
            "fillColors": "#F8F401",
            "id": "currentvalue",
            "lineThickness": 0,
            "title": "Current",
            "type": "column",
            "valueField": "currentvalue"
          },

          // {
          //   "balloonText": "[[title]] of [[category]]:[[value]]",
          //   "fillAlphas": 1,
          //   "fillColors": "#B568F9",
          //   "id": "Change",
          //   "lineThickness": 0,
          //   "title": "Change",
          //   "type": "column",
          //   "valueField": "Change"
          // },

          // {
          //   "balloonText": "[[title]] of [[category]]:[[value]]",
          //   "fillAlphas": 1,
          //   "fillColors": "#1AB91F",
          //   "id": " PerChange ",
          //   "lineThickness": 0,
          //   "title": "% Change",
          //   "type": "column",
          //   "valueField": "PerChange"
          // },
          {
            "balloonText": "[[title]] of [[category]]:[[value]]",
            "fillAlphas": 1,
            "fillColors": "#1AD8DD",
            "id": "DayChange",
            "lineThickness": 0,
            "title": "Day Change",
            "type": "column",
            "valueField": "DayChange"
          },

          {
            "balloonText": "[[title]] of [[category]]:[[value]]",
            "dashLength": 3,
            "fillAlphas": 1,
            "fillColors": "#F9B568",
            "id": "investmentamount",
            "lineThickness": 0,
            "title": "Investment",
            "type": "column",
            "valueField": "investmentamount"
          },

          // {
          //   "balloonText": "[[title]] of [[category]]:[[value]]",
          //   "dashLength": 3,
          //   "fillAlphas": 1,
          //   "fillColors": "#DAF7A6",
          //   "id": "realised",
          //   "lineThickness": 0,
          //   "title": "Realised Gain",
          //   "type": "column",
          //   "valueField": "realised"
          // },

          // {
          //   "balloonText": "[[title]] of [[category]]:[[value]]",
          //   "dashLength": 3,
          //   "fillAlphas": 1,
          //   "fillColors": "#1473FC",
          //   "id": "perrealised",
          //   "lineThickness": 0,
          //   "title": "Per Realised",
          //   "type": "column",
          //   "valueField": "perrealised"
          // },

          // {

          //   "balloonText": "[[title]] of [[category]]:[[value]]",
          //   "dashLength": 3,
          //   "fillAlphas": 1,
          //   "fillColors": "#F03B15",
          //   "id": "DayPerChange",
          //   "lineThickness": 0,
          //   "title": "Day % Change",
          //   "type": "column",
          //   "valueField": "DayPerChange"
          // },

          {
            "balloonText": "[[title]] of [[category]]:[[value]]",
            "dashLength": 3,
            "fillAlphas": 1,
            "fillColors": "#FA9985",
            "id": "TotalAmount",
            "lineThickness": 0,
            "title": "Total",
            "type": "column",
            "valueField": "TotalAmount"
          }
        ],

        "guides": [],
        "valueAxes": [
          {
            "id": "ValueAxis-1",
            "stackType": "regular",
            "title": "Axis title"
          }
        ],
        "allLabels": [],
        "balloon": {
          "animationDuration": 0,
          "borderThickness": 1,
          "shadowAlpha": 0.96,
          "showBullet": true
        },
        "legend": {
          "enabled": true,
          "labelWidth": 0,
          "useGraphSettings": true,
          "valueAlign": "left",
          "valueWidth": 11
        },

        "titles": [
          {
            "alpha": 0,
            "id": "Title-1",
            "size": 15,
            "text": ""
          }
        ],
        "dataProvider": this.dataProvider
      }
    );
  }

  shortened = false;
  hideSideNav(width) {

    if (width < 992 && !this.shortened) {
      $(".side_fixednav").toggleClass('side_fixed_hide');
      $(".main_wrapper").toggleClass('wrapper_full');
      this.shortened = true;
    }
    else if (width >= 992 && this.shortened) {
      $(".side_fixednav").toggleClass('side_fixed_hide');
      $(".main_wrapper").toggleClass('wrapper_full');
      this.shortened = false;
    }
  }
}

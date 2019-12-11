import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  single: any[];
  multi: any[];

  view: any[] = [1000, 300];
  analyticsData: any;
  // options
  chartData = [
    {
      name: "",
      series: []
    },
    {
      name: "",
      series: []
    },
  ];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Ariees Anyalitcs";
  showYAxisLabel = true;
  yAxisLabel = "Population";

  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"]
  };

  // line, area
  autoScale = true;

  constructor(private _httpClient: HttpClient) { }
  ngOnInit() {
    this.getAnalyticts().subscribe(data => {
      this.analyticsData = data.body;

      this.analyticsData.map(x => {
        this.chartData[0]["name"] = "total cost";
        this.chartData[0]["series"].push({
          name: x._id,
          value: x.total_cost
        });

        this.chartData[1]["name"] = "total orders";
        this.chartData[1]["series"].push({
          name: x._id,
          value: x.total_orders
        });

        // this.chartData[2]["name"] = "total cost";
        // this.chartData[2]["series"].push({
        //   name: x._id,
        //   value: x.total_cost
        // });

        // this.chartData[3]["name"] = "total_offers";
        // this.chartData[3]["series"].push({
        //   name: x._id,
        //   value: x.total_offers
        // });
      });
      this.chartData = [...this.chartData];
    });
  }



  onSelect(event) {
    console.log(event);
  }

  getAnalyticts() {
    return this._httpClient.get(`${environment.base_url}analytics`, {
      observe: "response"
    });
  }

  getBigChartsData() { }
}

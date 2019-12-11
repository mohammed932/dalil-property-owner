import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpUsersServices } from "../services/httpUsersServices";
import { switchMap } from "rxjs/internal/operators/switchMap";
import { tap } from "rxjs/operators";
import { User, EmployeeInfo } from "../modals/user";

@Component({
  selector: "app-employee-details",
  templateUrl: "./employee-details.component.html",
  styleUrls: ["./employee-details.component.scss"]
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId: string;
  employee: any;
  show = 3;

  imageFiles = [];
  files = [];
  constructor(
    private route: ActivatedRoute,
    private httpUsersService: HttpUsersServices
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          return this.httpUsersService.getSingleUser(params.get("id"));
        })
      )
      .subscribe((data: any) => {
        this.employee = data;
        this.findEachType(this.employee.employeeInfo.personal_files);
      });
  }

  findEachType(personalfilesList) {
    for (let file of personalfilesList) {
      if (this.isImagesUrl(file)) {
        this.imageFiles.push(file);
      } else {
        this.files.push(file);
      }
    }
  }

  private isImagesUrl(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }
}

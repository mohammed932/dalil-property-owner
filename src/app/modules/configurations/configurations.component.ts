import {
  Component,
  OnInit,
  Optional,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { MatDialog } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MapConfigService } from "../../shared/services/map/map-config.service";
import { HttpActivityService } from "./services/configurations.service";

@Component({
  selector: "app-configurations",
  templateUrl: "./configurations.component.html",
  styleUrls: ["./configurations.component.scss", "../tabel.scss"]
})
export class ConfigurationsComponent implements OnInit, OnDestroy {
  unit: string;
  activities: string[] = ["شاليهات"];
  // activities: string[] = ['شاليهات', 'قاعات', 'استراحات', 'قاعات_افراح', 'خدمات_حاصة', 'ضيافة', 'عروض', 'مخيمات'];

  officeData: any;
  configurationsForm: FormGroup;
  needToUpdate: boolean = true;
  isUploadNewImage = false;
  isEdit = false;
  selectedCategories: any[];
  startTime: Date = new Date();
  endTime: Date = new Date();
  isMeridian = false;
  allowArrowKeys = true;
  cities: any;
  occasions: any[];
  days = [
    {
      id: 1,
      name: "Sunday"
    },
    {
      id: 2,
      name: "Monday"
    },
    {
      id: 3,
      name: "Tuesday"
    },
    {
      id: 4,
      name: "Wednesday"
    },
    {
      id: 5,
      name: "Thursday"
    },
    {
      id: 6,
      name: "Friday"
    }
  ];
  cityPolyganOptions = {
    strokeColor: "#083478",
    fillColor: "#0c2461",
    strokeWeight: "4",
    fillOpacity: "0.5"
  };
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  locationValues: any[];
  imagePreview: any;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpActivityService: HttpActivityService,
    private fg: FormBuilder,
    private mapConfigService: MapConfigService
  ) {}

  ngOnInit() {
    this.configurationsForm = this.fg.group({
      name: [""],
      price: [""],
      category: [""],
      sub_category: [this.fg.array([])],
      capacity: [""],
      description: [""],
      location: [""],
      logo: [""],
      email: [""],
      images: [""],
      panoramic_images: [""],
      city: [""],
      area: [""],
      occasions: [""],
      pool_exist: [""],
      pool_desc: [""],
      bathrooms: [""],
      bedroom: [""],
      kitchen: [""],
      grill_area: [""],
      water_games: [""],
      kids_games: [""],
      playground: [""],
      sound_room: [""],
      mandi_barrel: [""],
      facilities: [""]
    });
    this.initFun();
  }

  getCities() {
    this.httpActivityService.getAllCities().subscribe(
      data => {
        if (data.status === 200) {
          this.cities = data["body"];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  initFun() {
    this.getCities();
  }

  onMapReady(map) {
    this.mapConfigService.initDrawingManager(map);
  }

  selectMarker(event) {
    this.locationValues = [event.coords.lng, event.coords.lat];
  }

  editConfigurationsData() {
    this.configurationsForm.enable();
    this.isEdit = true;
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== "undefined" && typeof objTwo !== "undefined") {
      return objOne === objTwo;
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notificationService.errorNotification(
        "This file is not supported, please upload image"
      );
    }
    this.configurationsForm.patchValue({ logo: file });
    this.configurationsForm.get("logo").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    const updateServiceWithNewImage = {
      name: this.configurationsForm["controls"].brand_name.value,
      description: this.configurationsForm["controls"].brand_desc.value,
      categories: this.selectedCategories
    };

    console.log(updateServiceWithNewImage);
  }
  ngOnDestroy() {
    // this.$destroy.next();
    // this.$destroy.complete();
  }
}

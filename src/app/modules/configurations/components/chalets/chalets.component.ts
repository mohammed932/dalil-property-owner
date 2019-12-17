import { Component, OnInit } from "@angular/core";
import { HttpActivityService } from "../../services/configurations.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from "@angular/forms";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { debounceTime, debounce } from "rxjs/operators";
import { timer } from "rxjs";
import { GeoLocationService } from "../../../../shared/services/map/geoLocation.service";

@Component({
  selector: "app-chalets",
  templateUrl: "./chalets.component.html",
  styleUrls: ["./chalets.component.scss"]
})
export class ChaletsComponent implements OnInit {
  panelOpenState = false;
  cities: any;
  configurationsForm: FormGroup;
  loading = false;
  selectedOptions = [];
  options: any;
  public threeSixtyImages = {
    0: [
      "https://images.unsplash.com/photo-1534294228306-bd54eb9a7ba8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80"
    ]
  };
  categories: any;
  subCategories: Object;
  selectedCategoryObj: any;
  selectedCityObj: any;
  selectedSubCategory: any[];
  selectedOccasions: any[] = [];
  isPool: boolean = false;
  imagePreview: string | ArrayBuffer;
  occasions: any;
  center: any = {
    lng: 46.72185,
    lat: 24.68773
  };
  isDisabled = false;
  locationValues = [];
  categoryId: string;
  cityId: string;
  occasionsForm = new FormControl(["", Validators.required]);
  subCategoryForm = new FormControl(["", Validators.required]);
  optionArray: FormArray;
  categoryItem: any;
  pool_desc: string = "";
  pool_desc_ar: string = "";
  departments_count: number = 0;
  isPoolExistBool: boolean = false;
  isCapacity: boolean = false;
  submitted = false;
  error = {
    name: false,
    name_ar: false,
    capacity: false,
    description: false,
    description_ar: false,
    price: false,
    terms_and_conditions: false,
    terms_and_conditions_ar: false
  };
  urlsImages: any[] = [];
  urlsPanoramaFiles: any[] = [];
  urls: any[] = [];
  urlsPanorama: any[] = [];
  constructor(
    private geoLocationService: GeoLocationService,
    private httpActivityService: HttpActivityService,
    private fg: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.configurationsForm = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required],
      price: ["", Validators.required],
      category: [""],
      sub_category: [this.fg.array([])],
      capacity: ["", Validators.required],
      description: ["", Validators.required],
      description_ar: ["", Validators.required],
      location: [""],
      logo: [""],
      email: [""],
      images: [""],
      panoramic_images: [""],
      city: ["", Validators.required],
      pool_exist: [""],
      terms_and_conditions_ar: [""],
      terms_and_conditions: [""],
      pool_desc: [""],
      pool_desc_ar: [""],
      options: new FormArray([])
    });

    this.initFun();
  }

  getCurrentLocation() {
    this.geoLocationService.getPosition().subscribe((pos: Position) => {
      this.center = {
        lat: +pos.coords.latitude,
        lng: +pos.coords.longitude
      };
      this.locationValues = [+pos.coords.longitude, +pos.coords.latitude];
      this.loading = false;
    });
  }
  selectMarker(event) {
    this.locationValues = [event.coords.lng, event.coords.lat];
  }

  b64toBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    let mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    let ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  get f() {
    return this.configurationsForm.controls;
  }
  get subCate() {
    return this.subCategoryForm;
  }

  getOptions(event) {
    this.categoryId = event.value._id;
    this.configurationsForm.reset();
    this.httpActivityService
      .getOptionForCategory(event.value._id)
      .subscribe(data => {
        this.options = data.body;
      });

    this.httpActivityService.getSubCategories(event.value._id).subscribe(
      data => {
        if (data.status === 200) {
          this.subCategories = data.body;
        }
      },
      err => {
        console.log(err);
      }
    );

    // remove options array
    let optionArray: FormArray = this.getOptionFormArray();
    this.clearFormArray(optionArray);
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

  showDepartments() {
    if (this.categoryItem.tag === "استراحات_افراح") {
      return true;
    } else {
      return false;
    }
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

  getCategories() {
    this.httpActivityService.getCategories().subscribe(
      data => {
        if (data.status === 200) {
          this.categories = data["body"];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getOccasion() {
    this.httpActivityService.getOccasions().subscribe((data: any) => {
      this.occasions = data;
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        let reader = new FileReader();
        this.urlsImages.push(event.target.files[i]);
        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  removeImg(index) {
    this.urls.splice(index, 1);
    this.urlsImages.splice(index, 1);
  }
  removePanorama(index) {
    this.urlsPanorama.splice(index, 1);
    this.urlsPanoramaFiles.splice(index, 1);
  }

  onSelectPanoramaFile(event) {
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;

      if (filesAmount <= 3 && this.urlsPanorama.length < 3) {
        for (let i = 0; i < filesAmount; i++) {
          this.urlsPanoramaFiles.push(event.target.files[i]);
          let reader = new FileReader();
          reader.onload = (event: any) => {
            this.urlsPanorama.push(event.target.result);
          };
          reader.readAsDataURL(event.target.files[i]);
        }
      } else {
        // @Todo Notification message
        this.notificationService.errorNotification(
          "من فضلك الصور 360 المسموح بيها حد اقصى 3 صور"
        );
      }
    }
  }

  isPoolExist(event) {
    if (event.target.value === "true") {
      this.isPoolExistBool = true;
    } else {
      this.isPoolExistBool = false;
    }
    // this.configurationsForm.controls.pool_exist.setValue(this.isPool);
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== "undefined" && typeof objTwo !== "undefined") {
      return objOne._id === objTwo._id;
    }
  }

  compareWithFn(item1, item2) {
    return item1 && item2 ? item1._id === item2._id : item1 === item2;
  }

  equalsOptions(objOne, objTwo) {
    if (typeof objOne !== "undefined" && typeof objTwo !== "undefined") {
      return objOne === objTwo;
    }
  }

  selectCategory(event) {}

  initFun() {
    this.getCities();
    this.getCategories();
    this.getOccasion();
  }

  getCategory() {
    const category = this.categories.find(
      category => this.categoryItem._id == category._id
    );
    return category._id;
  }

  getUploadedImages(formData) {
    for (var i = 0; i < this.urlsImages.length; i++) {
      if (typeof this.urlsImages[i] !== "string") {
        formData.append("images", this.urlsImages[i]);
      }
      if (typeof this.urlsImages === "string") {
        formData.append("images", this.b64toBlob(this.urlsImages[i]));
      }
    }
    return formData;
  }
  getUploadedPanoramaImages(formData) {
    for (var i = 0; i < this.urlsPanoramaFiles.length; i++) {
      if (typeof this.urlsImages[i] !== "string") {
        formData.append("panoramic_images", this.urlsPanoramaFiles[i]);
      }
      if (typeof this.urlsImages === "string") {
        formData.append(
          "panoramic_images",
          this.b64toBlob(this.urlsPanoramaFiles[i])
        );
      }
    }
    return formData;
  }
  appendImagesToActivity(formData, activityData) {
    this.getUploadedImages(formData);
    this.getUploadedPanoramaImages(formData);
    formData.append("data", JSON.stringify(activityData));
    return formData;
  }

  initialCarsForm(optionId): FormGroup {
    return this.fg.group({
      optionId: optionId,
      value: "",
      value_ar: ""
    });
  }

  getOptionFormArray() {
    return this.configurationsForm.get("options") as FormArray;
  }

  onAddNewOption(optionId) {
    this.optionArray = this.getOptionFormArray();
    this.optionArray.push(this.initialCarsForm(optionId));
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };
  removeOption(index) {
    let optionArray: FormArray = this.getOptionFormArray();
    optionArray.removeAt(index);
  }
  onSelectCategory(event) {
    let optionId = event.source.value._id;
    if (event.source._selected) {
      this.onAddNewOption(optionId);
    } else {
      const options = this.configurationsForm.value.options;
      let index = options.findIndex(
        option => option._id === event.source.value._id
      );
      this.removeOption(index);
    }
  }

  validateArText(value: string, formControlName) {
    const lastCharAr = value.substr(value.length - 1);
    const regExp = "^[\u0621-\u064A\u0660-\u0669s0-9 ]+$";
    if (!new RegExp(regExp).test(lastCharAr)) {
      value = value.substr(0, value.length - 1);
      this.error[`${formControlName}`] = true;

      this.configurationsForm.controls[`${formControlName}`].setValue(value);
    } else {
      this.error[`${formControlName}`] = false;
    }
  }

  validateEnText(value: string, formControlName) {
    const lastCharAr = value.substr(value.length - 1);
    const regExp = "^[A-Za-z-s0-9 ]";
    if (!new RegExp(regExp).test(lastCharAr)) {
      value = value.substr(0, value.length - 1);
      this.error[`${formControlName}`] = true;
      this.configurationsForm.controls[`${formControlName}`].setValue(value);
    } else {
      this.error[`${formControlName}`] = false;
    }
  }

  validateNumbersOnly(value: string, formControlName) {
    const lastCharAr = value.substr(value.length - 1);
    const regExp = "^[0-9]*$";
    if (!new RegExp(regExp).test(lastCharAr)) {
      value = value.substr(0, value.length - 1);
      this.error[`${formControlName}`] = true;
      this.configurationsForm.controls[`${formControlName}`].setValue(value);
    } else {
      this.error[`${formControlName}`] = false;
    }
  }

  createBackendSchema() {
    if (this.locationValues.length === 0) {
      this.locationValues[(this.center.lng, this.center.lat)];
    }
    const activityData = {
      name: this.configurationsForm.controls.name.value,
      price: parseInt(this.configurationsForm.controls.price.value),
      category: this.getCategory(),
      sub_category: this.selectedSubCategory,
      location: this.locationValues,
      city: this.configurationsForm.controls.city.value,
      terms_and_conditions: this.configurationsForm.controls
        .terms_and_conditions.value,
      occasions: this.selectedOccasions,
      description: this.configurationsForm.controls.description.value,
      options: this.createOptions(),
      capacity: parseInt(this.configurationsForm.controls.capacity.value),
      translation: {
        ar: {
          name: this.configurationsForm.controls.name_ar.value,
          description: this.configurationsForm.controls.description_ar.value,
          terms_and_conditions: this.configurationsForm.controls
            .terms_and_conditions_ar.value
        }
      }
    };

    return activityData;
  }

  createOptions() {
    let options = [];
    let existOptions = this.configurationsForm.value.options;
    options = existOptions.map(option => ({
      option: option.optionId,
      value: option.value,
      translation: {
        ar: {
          value: option.value_ar
        }
      }
    }));
    return options;
    // for (let index = 0; index < existOptions.length; index++) {
    //   let option = {
    //     option: '',
    //     value: '',
    //     translation: {
    //       ar: {
    //         value: ''
    //       }
    //     }
    //   };
    //   const element = existOptions[index];
    //   option['option'] = element.optionId;
    //   option['value'] = element.value;
    //   option['translation']['ar']['value'] = element.value_ar;
    //   options.push(option);
    // };
    // return options;
  }

  imuttubleActivityObj(activityData, urguments) {
    for (let index = 0; index < urguments.length; index++) {
      const element = urguments[index];
      if (element.lang !== "ar") {
        activityData[`${element["key"]}`] = element.value;
      } else if (element.lang === "both") {
        if (element.key !== "capacity" || element.key !== "departments_count") {
          activityData[`${element["key"]}`] = element.value;
          activityData.translation.ar[`${element["key"]}`] = element.value;
        } else {
          activityData[`${element["key"]}`] = parseInt(element.value);
          activityData.translation.ar[`${element["key"]}`] = parseInt(
            element.value
          );
        }
      } else {
        activityData.translation.ar[`${element["key"]}`] = element.value;
      }
    }
    return activityData;
  }
  onSubmit() {
    this.loading = true;
    this.submitted = true;
    this.isDisabled = true;
    if (!this.categoryId) {
      this.notificationService.errorNotification("من فضلك اختار فئة");
      this.isDisabled = false;
      return;
    }
    if (this.urls.length < 5) {
      this.notificationService.errorNotification(
        "من فضلك ادخل حد ادنى 5 من الصور"
      );
      this.loading = false;
      this.isDisabled = false;
      return;
    }
    // stop here if form is invalid
    if (this.configurationsForm.invalid) {
      this.loading = false;
      this.isDisabled = false;
      return;
    }

    const backEndData = this.createBackendSchema();
    if (
      this.categoryItem.tag === "شاليهات" ||
      this.categoryItem.tag === "استراحات" ||
      this.categoryItem.tag === "استراحات_افراح"
    ) {
      this.imuttubleActivityObj(backEndData, [
        {
          lang: "en",
          key: "pool_desc",
          value: this.pool_desc
        },
        {
          lang: "both",
          key: "pool_exist",
          value: this.isPoolExistBool
        },
        {
          lang: "ar",
          key: "pool_desc",
          value: this.pool_desc_ar
        },
        {
          lang: "en",
          key: "capacity",
          value: parseInt(this.configurationsForm.controls.capacity.value)
        }
      ]);
    }

    if (
      this.categoryItem.tag === "استراحات" ||
      this.categoryItem.tag === "استراحات_افراح"
    ) {
      this.imuttubleActivityObj(backEndData, [
        {
          lang: "both",
          key: "departments_count",
          value: this.departments_count
        }
      ]);
    }
    const formData = new FormData();
    this.appendImagesToActivity(formData, backEndData);
    this.httpActivityService
      .createProperty(formData)
      .pipe(debounce(() => timer(1000)))
      .subscribe(
        data => {
          this.notificationService.successNotification(
            `تم إضافة النشاط ${this.configurationsForm.controls.name_ar.value}`
          );
          this.loading = false;
          this.isDisabled = false;
        },
        err => {
          this.notificationService.errorNotification(err.error.message);
          this.loading = false;
          this.isDisabled = false;
        }
      );
  }
}

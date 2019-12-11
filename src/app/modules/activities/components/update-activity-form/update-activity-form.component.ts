import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { NotificationService } from '../../../../shared/services/notifications/notification.service';
import { HttpActivityService } from '../../../configurations/services/configurations.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, debounceTime, catchError, tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-update-activity-form',
  templateUrl: './update-activity-form.component.html',
  styleUrls: ['./update-activity-form.component.scss']
})
export class UpdateActivityFormComponent implements OnInit {
  panelOpenState = false;
  cities: any;
  areas: any;
  configurationsForm: FormGroup;
  loading = false;
  loadingData = true;
  selectedOptions = [];
  options: any;
  public threeSixtyImages =
    {
      0: ['https://images.unsplash.com/photo-1534294228306-bd54eb9a7ba8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80',
      ]
    }
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
  occasionsForm = new FormControl(['', Validators.required]);
  subCategoryForm = new FormControl(['', Validators.required]);
  optionArray: FormArray;
  categoryItem: any;
  pool_desc: string = '';
  pool_desc_ar: string = '';
  departments_count: number = 0;
  capacity: number = 1;
  isPoolExistBool: boolean = false;
  isCapacity: boolean = false;
  submitted = false;
  error = {
    name: false,
    name_ar: false,
    capacity: false,
    description: false,
    description_ar: false,
  }
  urlsImages: any[] = [];
  urlsPanoramaFiles: any[] = [];
  urls: any[] = [];
  urlsPanorama: any[] = [];
  activity: any;
  selectedOptionsIndexes: any = [];
  constructor(
    private httpActivityService: HttpActivityService,
    private fg: FormBuilder,
    private notificationService: NotificationService,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.configurationsForm = this.fg.group({
      name: ["", Validators.required],
      name_ar: ['', Validators.required],
      price: ["", Validators.required],
      category: [""],
      sub_category: [this.fg.array([])],
      capacity: [""],
      description: ["", Validators.required],
      description_ar: ["", Validators.required],
      location: [""],
      logo: [""],
      email: [''],
      city: ["", Validators.required],
      area: ["", Validators.required],
      pool_exist: [""],
      terms_and_conditions_ar: [""],
      terms_and_conditions: [""],
      pool_desc: [''],
      pool_desc_ar: [''],
      options: new FormArray([])
    });
    this.initFun();
    this.loadingData = true;
    this.activateRoute.paramMap.pipe(switchMap(x =>
      this.httpActivityService.getSingleActivity(x['params']['id'], this.loadingData)),
    )
      .subscribe(data => {
        this.loadingData = false;
        this.activity = data.body;
        this.setFormData(this.activity);
        this.getOptions(this.activity.category._id);
        if (this.activity.location.coordinates.length > 0) {
          this.locationValues = this.activity.location.coordinates;
        }

      });

  }

  selectMarker(event) {
    this.locationValues = [event.coords.lng, event.coords.lat];
  }

  get f() { return this.configurationsForm.controls; }
  get subCate() { return this.subCategoryForm }



  getOptions(categoryId) {
    this.httpActivityService.getOptionForCategory(categoryId).subscribe(data => {
      this.options = data.body;
    });
  }


  getSubCategory(categoryId) {
    this.httpActivityService.getSubCategories(categoryId).subscribe(data => {
      if (data.status === 200) {
        this.subCategories = data.body;
      }
    }, err => {
      console.log(err);
    });
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


  setFormData(activity) {
    this.urls = activity.images;
    this.urlsPanorama = activity.panoramic_images;
    this.configurationsForm.controls.name.setValue(activity.name);
    this.configurationsForm.controls.name_ar.setValue(activity.translation.ar.name);
    this.configurationsForm.controls.price.setValue(activity.price);
    this.configurationsForm.controls.city.setValue(activity.city._id);
    this.configurationsForm.controls.description.setValue(activity.description);
    this.configurationsForm.controls.description_ar.setValue(activity.translation.ar.description);
    this.configurationsForm.controls.terms_and_conditions_ar.setValue(activity.translation.ar.terms_and_conditions);
    this.configurationsForm.controls.terms_and_conditions.setValue(activity.terms_and_conditions);

    this.getCityAreas(activity.city._id);
    this.getSubCategory(activity.category._id);
    this.selectedSubCategory = activity.sub_category.map(category => category._id);
    this.selectedOccasions = activity.occasions.map(occasion => occasion._id);
    this.selectedOptionsIndexes = activity.options.map(option => option.option._id);
    this.selectedOptions = activity.options.map(option => option.option);
    this.categoryItem = activity.category;
    this.onAddNewOption(null, false, this.selectedOptions);
    this.configurationsForm.controls.area.setValue(activity.area._id);
  }

  getCities() {
    this.httpActivityService.getAllCities().subscribe(
      data => {
        if (data.status === 200) {
          this.cities = data['body'];
        }
      }, err => {
        console.log(err);
      }
    )
  }

  getCategories() {
    this.httpActivityService.getCategories().subscribe(data => {
      if (data.status === 200) {
        this.categories = data['body'];
      }
    }, err => {
      console.log(err);
    })
  }

  getOccasion() {
    this.httpActivityService.getOccasions()
      .subscribe(
        (data: any) => {
          this.occasions = data;
        }
      )
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        let reader = new FileReader();
        this.urlsImages.push(event.target.files[i]);
        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  removeImg(index) {
    this.httpActivityService.deleteImageFromApi(this.activity._id, 'image', this.urls[index]).subscribe(data => {
      if (data.status === 200) {
        this.notificationService.successNotification('تم مسح الصورة بنجاح')
        this.urls.splice(index, 1);
        this.urlsImages.splice(index, 1);
      }
    }, err => {
      this.notificationService.errorNotification(err.errors.message);
    })
  }
  removePanorama(index) {

    this.httpActivityService.deleteImageFromApi(this.activity._id, 'panorama', this.urlsPanorama[index]).subscribe(data => {
      if (data.status === 200) {
        this.notificationService.successNotification('تم مسح الصورة بنجاح')
        this.urlsPanorama.splice(index, 1);
        this.urlsPanoramaFiles.splice(index, 1);
      }
    }, err => {
      this.notificationService.errorNotification(err.errors.message);
    })
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
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      } else {
        // @Todo Notification message
        this.notificationService.errorNotification('من فضلك الصور 360 المسموح بيها حد اقصى 3 صور')
      }
    }
  }

  isPoolExist(event) {
    if (event.target.value === 'true') {
      this.isPoolExistBool = true;
    } else {
      this.isPoolExistBool = false;
    }
    // this.configurationsForm.controls.pool_exist.setValue(this.isPool);
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne === objTwo;
    }
  }

  compareWithFn(item1, item2) {
    return item1 && item2 ? item1._id === item2._id : item1 === item2;
  }


  equalsOptions(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne === objTwo;
    }
  }


  selectedCity(event) {
    this.areas = [];
    this.configurationsForm.controls.area.setValue('');
    this.cityId = event.target.value;
    this.getCityAreas(event.target.value)
  }

  getCityAreas(id) {
    this.httpActivityService.getCityAreas(id).subscribe(data => {
      if (data.status === 200) {
        this.areas = data['body'];
      }
    })
  }

  initFun() {
    this.getCities();
    this.getCategories();
    this.getOccasion();
  }


  getUploadedImages(formData) {

    for (var i = 0; i < this.urlsImages.length; i++) {
      if (typeof this.urlsImages[i] !== 'string') {
        formData.append("images", this.urlsImages[i]);
      }
      if (typeof this.urlsImages === 'string') {
        formData.append("images", this.b64toBlob(this.urlsImages[i]));
      }
    }
    return formData;
  }
  getUploadedPanoramaImages(formData) {

    for (var i = 0; i < this.urlsPanoramaFiles.length; i++) {
      if (typeof this.urlsImages[i] !== 'string') {
        formData.append("panoramic_images", this.urlsPanoramaFiles[i]);
      }
      if (typeof this.urlsImages === 'string') {
        formData.append("panoramic_images", this.b64toBlob(this.urlsPanoramaFiles[i]));
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
      value: '',
      value_ar: ''
    })
  }

  getOptionFormArray() {
    return this.configurationsForm.get('options') as FormArray;;
  }

  onAddNewOption(optionId, isEntered = false, data = undefined) {
    if (data instanceof Array && data !== undefined && data.length !== 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        this.optionArray = this.getOptionFormArray();
        this.optionArray.push(this.fg.group({
          optionId: element['_id'],
          value: element['name'],
          value_ar: element['translation']['ar']['name'],
        }));
      }
      return;
    }
    if (isEntered) {
      const option = this.options.find(option => optionId == option._id);
      this.selectedOptions.push(option);
      this.optionArray = this.getOptionFormArray();
      this.optionArray.push(this.initialCarsForm(optionId));
    }

  }



  b64toBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

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


  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  removeOption(index) {
    let optionArray: FormArray = this.getOptionFormArray();
    optionArray.removeAt(index);
  }
  onSelectCategory(event) {
    let optionId = event.source.value;
    if (event.source._selected && event.isUserInput) {
      this.onAddNewOption(optionId, true);
      return;
    }
    if (!event.source._selected && event.isUserInput) {
      const options = this.configurationsForm.value.options;
      let index = options.findIndex(option => option._id === event.source.value._id);
      this.removeOption(index);

    }
  }


  validateArText(value: string, formControlName) {
    const lastCharAr = value.substr(value.length - 1);
    const regExp = '^[\u0621-\u064A\u0660-\u0669\s0-9 ]+$';
    if (!(new RegExp(regExp).test(lastCharAr))) {
      value = value.substr(0, value.length - 1);
      this.error[`${formControlName}`] = true;
      this.configurationsForm.controls[`${formControlName}`].setValue(value);
    } else {
      this.error[`${formControlName}`] = false;
    }
  }

  validateEnText(value: string, formControlName) {
    const lastCharAr = value.substr(value.length - 1);
    const regExp = '^[\A-Za-z-\s0-9 ]';
    if (!(new RegExp(regExp).test(lastCharAr))) {
      value = value.substr(0, value.length - 1);
      this.error[`${formControlName}`] = true;
      this.configurationsForm.controls[`${formControlName}`].setValue(value);
    } else {
      this.error[`${formControlName}`] = false;
    }
  }

  validateNumbersOnly(value: string, formControlName) {
    const lastCharAr = value.substr(value.length - 1);
    const regExp = '^[0-9]*$';
    if (!(new RegExp(regExp).test(lastCharAr))) {
      value = value.substr(0, value.length - 1);
      this.error[`${formControlName}`] = true;
      this.configurationsForm.controls[`${formControlName}`].setValue(value);
    } else {
      this.error[`${formControlName}`] = false;
    }
  }

  createBackendSchema() {
    const activityData = {
      name: this.configurationsForm.controls.name.value,
      price: parseInt(this.configurationsForm.controls.price.value),
      category: this.activity.category._id,
      sub_category: this.selectedSubCategory,
      location: this.locationValues,
      city: this.configurationsForm.controls.city.value,
      area: this.configurationsForm.controls.area.value,
      terms_and_conditions: this.configurationsForm.controls.terms_and_conditions.value,
      occasions: this.selectedOccasions,
      description: this.configurationsForm.controls.description.value,
      options: this.createOptions(),
      capacity: this.capacity,
      translation: {
        ar: {
          name: this.configurationsForm.controls.name_ar.value,
          description: this.configurationsForm.controls.description_ar.value,
          terms_and_conditions: this.configurationsForm.controls.terms_and_conditions_ar.value,
        }
      }
    }
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
    return options
  }



  convertUrlImagesToBlob() {
    let urls = [];
    for (let index = 0; index < this.urls.length; index++) {
      const element = this.urls[index];

      urls.push(this.b64toBlob(element[index]));
    }
    return urls;
  }


  converPanoramaImages() {
    let urls = [];
    for (let index = 0; index < this.urlsPanorama.length; index++) {
      const element = this.urls[index];
      urls.push(this.b64toBlob(element[index]));
    }
    return urls;
  }

  imuttubleActivityObj(activityData, urguments) {
    for (let index = 0; index < urguments.length; index++) {
      const element = urguments[index];
      if (element.lang !== 'ar') {
        activityData[`${element['key']}`] = element.value;
      } else if (element.lang === 'both') {
        if (element.key !== 'capacity' || element.key !== 'departments_count') {
          activityData[`${element['key']}`] = element.value;
          activityData.translation.ar[`${element['key']}`] = element.value;
        } else {
          activityData[`${element['key']}`] = parseInt(element.value);
          activityData.translation.ar[`${element['key']}`] = parseInt(element.value);
        }
      } else {
        activityData.translation.ar[`${element['key']}`] = element.value;
      }
    }
    return activityData;
  }
  onSubmit() {
    this.loading = true;
    this.submitted = true;
    this.isDisabled = true;
    if (!this.createBackendSchema().category) {
      this.notificationService.errorNotification('من فضلك اختار فئة');
      this.isDisabled = false;
      return;
    }
    if (this.urls.length < 5) {
      this.notificationService.errorNotification('من فضلك ادخل حد ادنى 5 من الصور');
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
    if (this.categoryItem.translation.ar.name === 'شاليه' || this.categoryItem.translation.ar.name === 'استراحات') {
      this.imuttubleActivityObj(backEndData, [
        {
          lang: 'en',
          key: 'pool_desc',
          value: this.pool_desc
        },
        {
          lang: 'both',
          key: 'pool_exist',
          value: this.isPoolExistBool
        },
        {
          lang: 'ar',
          key: 'pool_desc',
          value: this.pool_desc_ar
        },
        {
          lang: 'en',
          key: 'capacity',
          value: this.capacity
        },
      ]);
      if (this.categoryItem.translation.tag === 'ضيافة' || this.categoryItem.tag === 'خدمات_خاصة') {
        this.imuttubleActivityObj(backEndData,
          [
            {
              lang: 'en',
              key: 'capacity',
              value: 1
            },
          ])
      }

      if (this.isPoolExistBool && (!this.pool_desc || !this.pool_desc_ar)) {
        this.notificationService.errorNotification('من فضلك ادخل تفاصيل المسبح');
        this.loading = false;
        this.isDisabled = false;
        return;
      }
    }

    if (this.categoryItem.translation.ar.name === 'استراحات') {
      this.imuttubleActivityObj(backEndData,
        [
          {
            lang: 'both',
            key: 'departments_count',
            value: this.departments_count
          }
        ])
    }
    const formData = new FormData();
    this.appendImagesToActivity(formData, backEndData);
    this.httpActivityService.updateProperty(formData, this.activity._id).pipe(
    ).subscribe(
      data => {
        this.notificationService.successNotification(`تم تعديل النشاط ${this.configurationsForm.controls.name_ar.value}`)
        this.loading = false;
        this.isDisabled = false;
      }, err => {
        this.notificationService.errorNotification(err.error.message);
        this.loading = false;
        this.isDisabled = false;
      }
    )
  }
}

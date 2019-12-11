import { Component, OnInit, Optional, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { HttpProductService } from './services/product.service';
import { NotificationService } from '../../shared/services/notifications/notification.service';
import { BoxAnimation } from '../../shared/animations/box-animation';

@Component({
  selector: "app-product",
  templateUrl: "./create-product.component.html",
  styleUrls: [
    "./create-product.component.scss",
  ],
  animations: [
    BoxAnimation
  ]
})

export class CreateProductComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  firstOptionForm: FormGroup;
  anotherOptionsForm: FormGroup;
  loading = false;

  selectFirstOptionCategory: string;
  categories: any;
  selectedCategories: any = {};
  categoryItems: any;
  countSelectCategory: number = 0;
  countAnotherSelectCategory: number = 0;
  imagePreview: any;
  bgPreview: any;
  categoriesForAnotherOptions: any;
  categoriesItemsForAnotherOptions: any;
  selectedItems: any = [];
  items = [];
  isConnected = false;
  isPrice = false;
  isCheckOverridingPrice = [];
  isConnectedCheck = [];
  image: any;
  backgroundImg: any;
  hideAddAnotherOptions = false;
  isAvaliableChocies = [];
  hideAddAnotherChoices = false;

  existSelectedCategories = [];
  constructor(
    private fg: FormBuilder,
    private httpProductService: HttpProductService,
    private notifcationService: NotificationService
  ) { }

  ngOnInit() {

    this.httpProductService.getCategories().subscribe(
      data => {
        if (data.status === 200) {
          this.categories = data.body;
          this.categoriesForAnotherOptions = data.body;
        }
      }
    )

    this.productForm = this.fg.group({
      name: ['', Validators.required],
      min_size: [null, Validators.required],
      max_size: [null, Validators.required],
      min_price: [null, Validators.required],
      max_price: [null, Validators.required],
      options: this.fg.array([])
    })

    this.firstOptionForm = this.fg.group({
      question: [''],
      category: [''],
      is_overriding_price: [''],
      is_mandatory: [true],
      choices: this.fg.array([])
    })


    this.anotherOptionsForm = this.fg.group({
      anotherOptions: this.fg.array([]),
    })

  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notifcationService.errorNotification(
        "This file is not supported, please upload image"
      );
    }
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onBgPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notifcationService.errorNotification(
        "This file is not supported, please upload image"
      );
    }
    this.backgroundImg = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.bgPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }





  addAnotherOption(i) {
    let control = (<FormArray>this.anotherOptionsForm.controls['anotherOptions'])
    control.push(
      this.fg.group({
        category: [''],
        question: [''],
        is_overriding_price: [false],
        is_connected_to_previous_option: [false],
        is_mandatory: [false],
        is_multiple_choice: [false],
        choices: this.fg.array([]),
      })
    )

    const existCategoriesInForm = Object.assign({}, this.anotherOptionsForm.value);
    let options = [...existCategoriesInForm.anotherOptions];
    if (options.length === this.categories.length) {
      this.hideAddAnotherOptions = true;
    }
  }
  // function which pushed new value to collections array
  addCollectionId(form, val) {
    const collections = form.controls.connected_items;
    // add only once
    if (!collections.value.includes(val)) {
      collections.push(this.fg.control(val));
    }
  }

  getanotherOptions() {
    return (<FormArray>this.anotherOptionsForm.get('anotherOptions')).controls;
  }



  getCategoriesForAnotherOption() {
    let categories = [...this.categories];
    return categories;
  }

  getCategoriesItemsForAnotherOption(i) {
    if (this.items[i] === undefined) {
      return this.items[i] = [];
    }
    return this.items[i];
  }



  getSelectedAnotherOption(selectedCategoryId, i) {
    this.httpProductService.getCategoryItems(selectedCategoryId).subscribe(categoryItems => {
      if (categoryItems.status === 200) {
        this.categoriesItemsForAnotherOptions = categoryItems.body;
        let currentCategory = this.categories.find(category => category._id === selectedCategoryId);
        let categoryIndex = this.categories.findIndex((obj => obj._id == currentCategory._id));
        this.selectedCategories[i] = currentCategory;

        if (this.existSelectedCategories[i] !== undefined && this.existSelectedCategories[i] !== null) {

          // change previous category selected to be false; 
          this.existSelectedCategories[i].selected = false;

          // change the old selected cateogry to be false in the displayed categories
          this.categories[categoryIndex].selected = false;

          // set the current selected category to be true cuz it will be disabled
          currentCategory.selected = true;

          // set the current category to the same index of the existSelectedCategories 
          // because we want to determine which category location in options
          // to be disabled for example 
          // if we select [size] from the first option
          this.existSelectedCategories.splice(i, 1, currentCategory);

          // check the current avaliable categories by the selected categories 
          // and for each category exist in [existSelectedCategories] make it true in [categories]
          this.checkSelectedCategoryStatus(this.categories, this.existSelectedCategories);

        } else {
          // this for item where doesn't exist in the [existSelectedCategories]
          // we will push it to array and before pushing the current category 
          // we need to set the selected of current category to be true;
          currentCategory.selected = true;
          this.categories[categoryIndex].selected = true;
          this.existSelectedCategories.push(currentCategory);
        }

        // this funtion will solve the referance of the items problem   
        this.setItemsOfSelectedCategories(i, this.categoriesItemsForAnotherOptions)
      }
    })
  }


  setItemsOfSelectedCategories(index, categoriesItems) {
    if (this.items[index] !== undefined) {
      this.items.splice(index, 1, categoriesItems);
    } else {
      this.items.push(categoriesItems);
    }
  }

  checkSelectedCategoryStatus(categories, existSelectedCategories) {
    for (const category of categories) {
      for (const selectedCategories of existSelectedCategories) {
        if (selectedCategories._id === category._id) {
          category.selected = true;
          break;
        }
      }
    }
  }

  getSelectedFirstOptionCategoryItem(selectedCategoryItemId, j) {
    let selectedCatItem = this.categoryItems.find(item => item._id === selectedCategoryItemId);
    selectedCatItem.selected = true;
    if (!this.selectedItems[0]) {
      this.selectedItems[0] = [];
    }
    if (this.selectedItems[0][j] !== undefined) {
      this.selectedItems[0].splice(j, 1, selectedCatItem);
    } else {
      this.selectedItems[0].push(selectedCatItem);
    }
  }

  getSelectedAnotherOptionItem(selectedCategoryItemId, i, j) {
    let selectedCatItem = this.categoriesItemsForAnotherOptions.find(item => item._id === selectedCategoryItemId);
    selectedCatItem.selected = true;
    if (!this.selectedItems[i]) {
      this.selectedItems[i] = [];
    }
    if (this.selectedItems[i][j] !== undefined) {
      this.selectedItems[i].splice(j, 1, selectedCatItem);
      this.getIsConnected(i + 1);
    } else {
      this.selectedItems[i].push(selectedCatItem);
    }
  }

  isOvrridePrice(isChecked, option, index) {
    option.controls.is_overriding_price.setValue(isChecked);
    this.isPrice = isChecked;
    if (this.isCheckOverridingPrice.indexOf(index) === -1) {
      this.isCheckOverridingPrice.push(index);
    } else {
      this.isCheckOverridingPrice.splice(index, 1);
    }
  }

  isMandatory(isChecked, option, index) {
    option.controls.is_mandatory.setValue(isChecked);
  }

  isMultipleChoice(isChecked, option, index) {
    option.controls.is_multiple_choice.setValue(isChecked);
  }

  isConnectedWithPrevious(isChecked, option, index) {
    this.isConnected = isChecked;
    option.controls.is_connected_to_previous_option.setValue(isChecked);

    if (this.isConnectedCheck.indexOf(index) === -1) {
      this.isConnectedCheck.push(index);
    } else {
      this.isConnectedCheck.splice(index, 1);
    }
  }


  addAnotherCategoryItemAnotherOption(i) {
    this.createAnotherOptionChoices(i);
  }

  getAvaliableChoices(i) {
    const avaliableChoices = Object.assign({}, this.anotherOptionsForm.value);
    return avaliableChoices.anotherOptions[i].choices.length;
  }

  createAnotherOptionChoices(i) {
    let control = (<FormArray>this.anotherOptionsForm.controls['anotherOptions']).controls[i]['controls']['choices'];

    control.push(this.fg.group({
      item: [''],
      price: [''],
      connected_items: this.fg.array([])
    }))
  }

  getIsConnected(index) {
    return this.selectedItems[index];
  }

  getChoices(form) {
    return form.controls.choices.controls
  }

  ngOnDestroy() {
  }

  // helper function that check if product proprties does not have values
  isEmpty(obj) {
    Object.keys(obj).forEach(function (key) {
      if (obj[key] === undefined || obj[key] === 0) {
        return true;
      }
    });
    return false;
  }



  // helper function that check if options does not exist
  isOptionsEmpty(options) {
    for (let i = 0; i < options.length; i++) {
      if (options[i] === null) {
        return true;
      }

      if (options[i].choices === 0 || options[i].choices === undefined) {
        return true;
      }
    }

    return false;
  }

  // append the image and backround to formData
  appendImagesToProduct(formData, productData) {
    formData.append("image", this.image);
    formData.append("cover", this.backgroundImg);
    formData.append("data", JSON.stringify(productData));
  }

  // change product data strings to be numbers
  finalProductData() {
    let productData = Object.assign({}, this.productForm.value);
    productData.max_price = Number(productData.max_price);
    productData.min_price = Number(productData.min_price);
    productData.max_size = Number(productData.max_size);
    productData.min_size = Number(productData.min_size);
    return productData;
  }
  submit() {
    this.loading = true;
    const productData = this.finalProductData();
    const formTwo = Object.assign({}, this.anotherOptionsForm.value);
    productData.options = [...formTwo.anotherOptions];
    const formData = new FormData();
    this.isOptionsEmpty(productData.options);
    this.appendImagesToProduct(formData, productData);

    if (this.isOptionsEmpty(productData.options)) {
      this.loading = false;
      return this.notifcationService.errorNotification('Please fill the data')
    }
    if (this.isEmpty(productData)) {
      this.loading = false;
      return this.notifcationService.errorNotification('Please fill the data')
    }
    if (productData.options.length === 0 || productData.options === undefined) {
      this.loading = false;
      return this.notifcationService.errorNotification('Please fill the data')
    }

    this.httpProductService.sendProductData(formData).subscribe(data => {
      if (data.status === 200) {
        this.notifcationService.successNotification('The product created');
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.notifcationService.errorNotification(err.message);
    });
  }
}

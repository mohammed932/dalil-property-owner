import { Component, OnInit } from '@angular/core';
import { TermsAndConditionService } from '../../service/termsAndCondition.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-term-condition',
  templateUrl: './term-condition.component.html',
  styleUrls: ['./term-condition.component.scss']
})
export class TermConditionComponent implements OnInit {
  terms: any;
  constructor(
    private termsService: TermsAndConditionService,
    private location: Location
  ) { }

  ngOnInit() {
    this.termsService.getTermsAndConditions().subscribe(data => {
      if (data.status === 200) {
        this.terms = data.body;
      }
    })
  }

  goBack() {
    this.location.back();
  }
}

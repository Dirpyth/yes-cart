/*
 * Copyright 2009 Inspire-Software.com
 *
 *    Licensed under the Apache License, Version 2.0 (the 'License');
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an 'AS IS' BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Component,  OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TaxVO, SearchContextVO } from './../model/index';
import { PricingService } from './../services/index';
import { ModalComponent, ModalResult, ModalAction } from './../modal/index';
import { Futures, Future, FormValidationEvent } from './../event/index';
import { Config } from './../../../environments/environment';

import { LogUtil } from './../log/index';

@Component({
  selector: 'cw-tax-select',
  templateUrl: 'tax-select.component.html',
})

export class TaxSelectComponent implements OnInit, OnDestroy {

  @Output() dataSelected: EventEmitter<FormValidationEvent<TaxVO>> = new EventEmitter<FormValidationEvent<TaxVO>>();

  private _selectedShopCode: string;

  private _selectedCurrency: string;

  @ViewChild('taxModalDialog')
  private taxModalDialog:ModalComponent;

  public validForSelect:boolean = false;

  public filteredTaxes : TaxVO[] = [];
  public taxFilter : string;

  private selectedTax : TaxVO = null;

  private delayedFiltering:Future;
  private delayedFilteringMs:number = Config.UI_INPUT_DELAY;
  private filterCap:number = Config.UI_FILTER_CAP;

  public taxFilterCapped:boolean = false;

  public loading:boolean = false;

  constructor (private _taxService : PricingService) {
    LogUtil.debug('TaxSelectComponent constructed');
    let that = this;
    this.delayedFiltering = Futures.perpetual(function() {
      that.getAllTaxes();
    }, this.delayedFilteringMs);
  }


  @Input()
  set selectedShopCode(value: string) {
    this._selectedShopCode = value;
    this.filteredTaxes = [];
  }

  get selectedShopCode(): string {
    return this._selectedShopCode;
  }

  @Input()
  set selectedCurrency(value: string) {
    this._selectedCurrency = value;
    this.filteredTaxes = [];
  }

  get selectedCurrency(): string {
    return this._selectedCurrency;
  }

  ngOnDestroy() {
    LogUtil.debug('TaxSelectComponent ngOnDestroy');
  }

  ngOnInit() {
    LogUtil.debug('TaxSelectComponent ngOnInit');
  }

  onSelectClick(tax: TaxVO) {
    LogUtil.debug('TaxSelectComponent onSelectClick', tax);
    this.selectedTax = tax;
    this.validForSelect = true;
  }

  onFilterChange() {

    this.delayedFiltering.delay();

  }

  onClearFilter() {
    this.taxFilter = '';
    this.delayedFiltering.delay();
  }

  showDialog() {
    LogUtil.debug('TaxSelectComponent showDialog');
    this.taxModalDialog.show();
    if (this.filteredTaxes.length == 0) {
      this.delayedFiltering.delay();
    }
  }


  onSelectConfirmationResult(modalresult: ModalResult) {
    LogUtil.debug('TaxSelectComponent onSelectConfirmationResult modal result is ', modalresult);
    if (ModalAction.POSITIVE === modalresult.action) {
      this.dataSelected.emit({ source: this.selectedTax, valid: true });
      this.selectedTax = null;
    }
  }

  private getAllTaxes() {

    this.loading = true;
    let _ctx:SearchContextVO = {
      parameters : {
        filter: [ this.taxFilter ],
        shopCode: [ this.selectedShopCode ],
        currency: [ this.selectedCurrency ]
      },
      start : 0,
      size : this.filterCap,
      sortBy : 'code',
      sortDesc : false
    };
    this._taxService.getFilteredTax(_ctx).subscribe(alltaxes => {
      LogUtil.debug('TaxSelectComponent getAllTaxes', alltaxes);
      this.selectedTax = null;
      this.validForSelect = false;
      this.filteredTaxes = alltaxes != null ? alltaxes.items : [];
      this.taxFilterCapped = alltaxes != null && alltaxes.total > this.filterCap;
      this.loading = false;
    });
  }

}

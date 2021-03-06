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
import { Component,  OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ShopVO, ShopSupportedCurrenciesVO, Pair } from './../model/index';
import { ShopService } from './../services/index';
import { Futures, Future } from './../event/index';
import { Config } from './../../../environments/environment';

import { LogUtil } from './../log/index';

@Component({
  selector: 'cw-currency-select',
  templateUrl: 'currency-select.component.html',
})

export class CurrencySelectComponent implements OnInit, OnDestroy {

  @Output() dataSelected: EventEmitter<string> = new EventEmitter<string>();

  private _shop : ShopVO;

  private currencies : Pair<string, string>[] = [];
  private shopCurrencies : Pair<string, string>[] = [];
  public filteredCurrencies : Pair<string, string>[] = [];
  public currencyFilter : string;

  private selectedCurrency : string = null;

  private delayedFiltering:Future;
  private delayedFilteringMs:number = Config.UI_INPUT_DELAY;

  constructor (private _currencyService : ShopService) {
    LogUtil.debug('CurrencySelectComponent constructed');
  }

  @Input()
  get shop():ShopVO {
    return this._shop;
  }

  set shop(shop:ShopVO) {
    this._shop = shop;
    this.getAllCurrencies();
  }


  ngOnDestroy() {
    LogUtil.debug('CurrencySelectComponent ngOnDestroy');
  }

  ngOnInit() {
    LogUtil.debug('CurrencySelectComponent ngOnInit');
    let that = this;
    this.delayedFiltering = Futures.perpetual(function() {
      that.filterCurrencies();
    }, this.delayedFilteringMs);

    this.getAllCurrencies();

  }

  onSelectClick(currency: string) {
    LogUtil.debug('CurrencySelectComponent onSelectClick', currency);
    this.selectedCurrency = currency;
    this.dataSelected.emit(this.selectedCurrency);
  }

  isShopCurrency(currency:Pair<string, string>) {
    return this.shopCurrencies.find(val => {
      return val.first == currency.first;
    }) != null;
  }

  onFilterChange() {

    this.delayedFiltering.delay();

  }

  onClearFilter() {
    this.currencyFilter = '';
    this.delayedFiltering.delay();
  }

  private getAllCurrencies() {

    if (this.shop != null) {
      this._currencyService.getShopCurrencies(this.shop.shopId).subscribe((allcurrencies:ShopSupportedCurrenciesVO) => {
        LogUtil.debug('CurrencySelectComponent getAllCurrencies', allcurrencies);
        this.currencies = allcurrencies.all;
        this.shopCurrencies = allcurrencies.supported;
        this.filterCurrencies();
      });
    } else {
      this.currencies = [];
      this.shopCurrencies = [];
      this.filterCurrencies();
    }
  }


  private filterCurrencies() {

    let _filter = this.currencyFilter ? this.currencyFilter.toLowerCase() : null;

    if (_filter) {
      this.filteredCurrencies = this.currencies.filter(currency =>
        currency.first.toLowerCase().indexOf(_filter) !== -1 ||
        currency.second.toLowerCase().indexOf(_filter) !== -1
      );
      LogUtil.debug('CurrencySelectComponent filterCurrencies', _filter);
    } else {
      this.filteredCurrencies = this.currencies;
      LogUtil.debug('CurrencySelectComponent filterCurrencies no filter');
    }

    if (this.filteredCurrencies === null) {
      this.filteredCurrencies = [];
    }

    let that = this;
    let _sort = function(a:Pair<string, string>, b:Pair<string, string>):number {

      let aShop = that.isShopCurrency(a);
      let bShop = that.isShopCurrency(b);

      if (aShop && !bShop) {
        return -1;
      } else if (!aShop && bShop) {
        return 1;
      }

      return (a.first < b.first) ? -1 : 1;

    };

    this.filteredCurrencies.sort(_sort);


  }

}

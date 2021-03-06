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
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CustomerOrderService, UserEventBus } from './../shared/services/index';
import { ModalComponent } from './../shared/modal/index';
import { PaymentVO, Pair, SearchResultVO } from './../shared/model/index';
import { Futures, Future } from './../shared/event/index';
import { Config } from './../../environments/environment';
import { UiUtil } from './../shared/ui/index';
import { LogUtil } from './../shared/log/index';

@Component({
  selector: 'cw-all-payments',
  templateUrl: 'all-payments.component.html',
})

export class AllPaymentsComponent implements OnInit, OnDestroy {

  private static _operations:Pair<string, boolean>[] = [
    { first: 'AUTH', second: false },
    { first: 'REVERSE_AUTH', second: false },
    { first: 'CAPTURE', second: false },
    { first: 'VOID_CAPTURE', second: false },
    { first: 'AUTH_CAPTURE', second: false },
    { first: 'REFUND', second: false },
  ];

  private static _statuses:Pair<string, boolean>[] = [
    { first: 'Ok', second: false },
    { first: 'Failed', second: false },
    { first: 'Processing', second: false },
    { first: 'Manual processing required', second: false },
  ];

  private static _incommingPayments:string[] = [
    'AUTH', 'AUTH_CAPTURE', 'CAPTURE'
  ];

  private static _outgoingPayments:string[] = [
    'REFUND', 'REVERSE_AUTH', 'VOID_CAPTURE'
  ];

  private static _pendingPayments:string[] = [
    'Processing', 'Failed', 'Manual processing required'
  ];

  private static _failedPayments:string[] = [
    'Failed', 'Manual processing required'
  ];

  private static _completedPayments:string[] = [
    'Ok'
  ];

  public searchHelpShow:boolean = false;
  public forceShowAll:boolean = false;

  public payments:SearchResultVO<PaymentVO>;
  public paymentFilter:string;
  public paymentFilterRequired:boolean = true;

  private delayedFiltering:Future;
  private delayedFilteringMs:number = Config.UI_INPUT_DELAY;

  public selectedPayment:PaymentVO;

  @ViewChild('transactionDetailsModalDialog')
  private transactionDetailsModalDialog:ModalComponent;

  public loading:boolean = false;

  public changed:boolean = false;
  public validForSave:boolean = false;

  constructor(private _paymentService:CustomerOrderService) {
    LogUtil.debug('AllPaymentsComponent constructed');
    this.payments = this.newSearchResultInstance();
  }

  newSearchResultInstance():SearchResultVO<PaymentVO> {
    return {
      searchContext: {
        parameters: {
          filter: [],
          statuses: [],
          operations: []
        },
        start: 0,
        size: Config.UI_TABLE_PAGE_SIZE,
        sortBy: 'createdTimestamp',
        sortDesc: true
      },
      items: [],
      total: 0
    };
  }

  ngOnInit() {
    LogUtil.debug('AllPaymentsComponent ngOnInit');
    this.onRefreshHandler();
    let that = this;
    this.delayedFiltering = Futures.perpetual(function() {
      that.getFilteredPayments();
    }, this.delayedFilteringMs);

  }

  get operations():Pair<string, boolean>[] {
    return AllPaymentsComponent._operations;
  }

  set operations(value:Pair<string, boolean>[]) {
    AllPaymentsComponent._operations = value;
  }

  get statuses():Pair<string, boolean>[] {
    return AllPaymentsComponent._statuses;
  }

  set statuses(value:Pair<string, boolean>[]) {
    AllPaymentsComponent._statuses = value;
  }

  ngOnDestroy() {
    LogUtil.debug('AllPaymentsComponent ngOnDestroy');
  }


  onFilterChange(event:any) {
    this.payments.searchContext.start = 0; // changing filter means we need to start from first page
    this.delayedFiltering.delay();
  }

  onRefreshHandler() {
    LogUtil.debug('AllPaymentsComponent refresh handler');
    if (UserEventBus.getUserEventBus().current() != null) {
      this.getFilteredPayments();
    }
  }

  onPageSelected(page:number) {
    LogUtil.debug('AllPaymentsComponent onPageSelected', page);
    this.payments.searchContext.start = page;
    this.delayedFiltering.delay();
  }

  onSortSelected(sort:Pair<string, boolean>) {
    LogUtil.debug('AllPaymentsComponent ononSortSelected', sort);
    if (sort == null) {
      this.payments.searchContext.sortBy = null;
      this.payments.searchContext.sortDesc = false;
    } else {
      this.payments.searchContext.sortBy = sort.first;
      this.payments.searchContext.sortDesc = sort.second;
    }
    this.delayedFiltering.delay();
  }

  onPaymentSelected(data:PaymentVO) {
    LogUtil.debug('AllPaymentsComponent onPaymentSelected', data);
    this.selectedPayment = data;
  }

  onSearchNumber() {
    this.searchHelpShow = false;
    this.paymentFilter = '#';
  }

  onSearchCustomer() {
    this.searchHelpShow = false;
    this.paymentFilter = '?';
  }

  onSearchDetails() {
    this.searchHelpShow = false;
    this.paymentFilter = '@';
  }

  onSearchInshop() {
    this.searchHelpShow = false;
    this.paymentFilter = '^';
  }

  onSearchDate() {
    this.searchHelpShow = false;
    this.paymentFilter = UiUtil.exampleDateSearch();
    this.getFilteredPayments();
  }

  onSearchStatusOpen() {
    //this.searchHelpShow = false;
    //this.paymentFilter = '~~';
    this.statuses.forEach((_st:Pair<string, boolean>) => {
      _st.second = AllPaymentsComponent._pendingPayments.includes(_st.first);
    });
    this.getFilteredPayments();
  }

  onSearchStatusPaymentIncoming() {
    //this.searchHelpShow = false;
    //this.paymentFilter = '$+';
    this.operations.forEach((_op:Pair<string, boolean>) => {
      _op.second = AllPaymentsComponent._incommingPayments.includes(_op.first);
    });
    this.getFilteredPayments();
  }

  onSearchStatusPaymentOutgoing() {
    //this.searchHelpShow = false;
    //this.paymentFilter = '$-';
    this.operations.forEach((_op:Pair<string, boolean>) => {
      _op.second = AllPaymentsComponent._outgoingPayments.includes(_op.first);
    });
    this.getFilteredPayments();
  }

  onSearchStatusCancelled() {
    //this.searchHelpShow = false;
    //this.paymentFilter = '--';
    this.statuses.forEach((_st:Pair<string, boolean>) => {
      _st.second = AllPaymentsComponent._failedPayments.includes(_st.first);
    });
    this.getFilteredPayments();
  }

  onSearchStatusCompleted() {
    //this.searchHelpShow = false;
    //this.paymentFilter = '++';
    this.statuses.forEach((_st:Pair<string, boolean>) => {
      _st.second = AllPaymentsComponent._completedPayments.includes(_st.first);
    });
    this.getFilteredPayments();
  }

  onSearchHelpToggle() {
    this.searchHelpShow = !this.searchHelpShow;
  }

  onForceShowAll() {
    this.forceShowAll = !this.forceShowAll;
    this.getFilteredPayments();
  }

  onRowInfoPaymentSelected() {
    if (this.selectedPayment != null) {
      this.transactionDetailsModalDialog.show();
    }
  }


  onSaveHandler() {

    if (this.validForSave && this.changed) {

      LogUtil.debug('AllPaymentsComponent Save handler payment', this.selectedPayment);

    }

  }

  onDiscardEventHandler() {
    LogUtil.debug('AllPaymentsComponent discard handler');
  }


  onClearFilter() {

    this.paymentFilter = '';
    this.getFilteredPayments();

  }


  private getFilteredPayments() {
    this.paymentFilterRequired = !this.forceShowAll && (this.paymentFilter == null || this.paymentFilter.length < 2);

    LogUtil.debug('AllPaymentsComponent getFilteredPayments' + (this.forceShowAll ? ' forcefully': ''));

    if (!this.paymentFilterRequired) {
      this.loading = true;

      let ops:string[] = [];
      AllPaymentsComponent._operations.forEach((_op:Pair<string, boolean>) => {
        if (_op.second) {
          ops.push(_op.first);
        }
      });

      let sts:string[] = [];
      AllPaymentsComponent._statuses.forEach((_st:Pair<string, boolean>) => {
        if (_st.second) {
          sts.push(_st.first);
        }
      });

      this.payments.searchContext.parameters.filter = [ this.paymentFilter ];
      this.payments.searchContext.parameters.statuses = sts;
      this.payments.searchContext.parameters.operations = ops;
      this.payments.searchContext.size = Config.UI_TABLE_PAGE_SIZE;

      this._paymentService.getFilteredPayments(this.payments.searchContext).subscribe( allpayments => {
        LogUtil.debug('AllPaymentsComponent getFilteredPayments', allpayments);
        this.payments = allpayments;
        this.selectedPayment = null;
        this.changed = false;
        this.validForSave = false;
        this.loading = false;
      });
    } else {
      this.payments = this.newSearchResultInstance();
      this.selectedPayment = null;
      this.changed = false;
      this.validForSave = false;
    }
  }

}

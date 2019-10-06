/*
 * Copyright 2009 - 2016 Denys Pavlov, Igor Azarnyi
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
import { FulfilmentService, UserEventBus, Util } from './../shared/services/index';
import { ModalComponent, ModalResult, ModalAction } from './../shared/modal/index';
import { FulfilmentCentreSelectComponent, InventoryInfoComponent } from './../shared/fulfilment/index';
import { InventoryVO, FulfilmentCentreInfoVO } from './../shared/model/index';
import { FormValidationEvent, Futures, Future } from './../shared/event/index';
import { Config } from './../shared/config/env.config';
import { LogUtil } from './../shared/log/index';
import { CookieUtil } from './../shared/cookies/index';

@Component({
  selector: 'yc-centre-inventory',
  moduleId: module.id,
  templateUrl: 'centre-inventory.component.html',
})

export class CentreInventoryComponent implements OnInit, OnDestroy {

  private static COOKIE_CENTRE:string = 'ADM_UI_FFCENTRE';

  private static _selectedCentre:FulfilmentCentreInfoVO;

  private static OFFERS:string = 'offers';
  private static OFFER:string = 'offer';

  private searchHelpShow:boolean = false;
  private forceShowAll:boolean = false;
  private viewMode:string = CentreInventoryComponent.OFFERS;

  private inventory:Array<InventoryVO> = [];
  private inventoryFilter:string;
  private inventoryFilterRequired:boolean = true;
  private inventoryFilterCapped:boolean = false;

  private delayedFiltering:Future;
  private delayedFilteringMs:number = Config.UI_INPUT_DELAY;
  private filterCap:number = Config.UI_FILTER_CAP;
  private filterNoCap:number = Config.UI_FILTER_NO_CAP;

  private selectedInventory:InventoryVO;

  private inventoryEdit:InventoryVO;

  @ViewChild('deleteConfirmationModalDialog')
  private deleteConfirmationModalDialog:ModalComponent;

  @ViewChild('selectCentreModalDialog')
  private selectCentreModalDialog:FulfilmentCentreSelectComponent;

  @ViewChild('inventoryInfoDialog')
  private inventoryInfoDialog:InventoryInfoComponent;

  private deleteValue:String;

  private selectedSkuCode:String;

  private loading:boolean = false;

  private changed:boolean = false;
  private validForSave:boolean = false;

  private userSub:any;

  constructor(private _fulfilmentService:FulfilmentService) {
    LogUtil.debug('CentreInventoryComponent constructed');
  }

  get selectedCentre():FulfilmentCentreInfoVO {
     return CentreInventoryComponent._selectedCentre;
  }

  set selectedCentre(selectedCentre:FulfilmentCentreInfoVO) {
    CentreInventoryComponent._selectedCentre = selectedCentre;
  }

  newInventoryInstance():InventoryVO {
    return {
      skuWarehouseId: 0,
      skuCode: '',
      skuName: '',
      warehouseCode: this.selectedCentre.code,
      warehouseName: this.selectedCentre.name,
      quantity: 0,
      reserved: 0,
      tag: null,
      disabled: false, availablefrom: null, availableto: null, releaseDate: null,
      availability: 1,
      featured: false,
      minOrderQuantity: undefined, maxOrderQuantity: undefined, stepOrderQuantity: undefined,
      restockDate: null,
      restockNotes: []
    };
  }

  ngOnInit() {
    LogUtil.debug('CentreInventoryComponent ngOnInit');

    this.onRefreshHandler();

    this.userSub = UserEventBus.getUserEventBus().userUpdated$.subscribe(user => {
      this.presetFromCookie();
    });

    let that = this;
    this.delayedFiltering = Futures.perpetual(function() {
      that.getFilteredInventory();
    }, this.delayedFilteringMs);

  }

  ngOnDestroy() {
    LogUtil.debug('CentreInventoryComponent ngOnDestroy');
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  protected presetFromCookie() {

    if (this.selectedCentre == null) {
      let ffCode = CookieUtil.readCookie(CentreInventoryComponent.COOKIE_CENTRE, null);
      if (ffCode != null) {
        let _sub:any = this._fulfilmentService.getAllFulfilmentCentres().subscribe(
          rez => {
            _sub.unsubscribe();
            let ffs:FulfilmentCentreInfoVO[] = rez;
            ffs.forEach(ff => {
              if (ffCode == ff.code) {
                this.selectedCentre = ff;
                LogUtil.debug('CentreInventoryComponent ngOnInit preselect ff centre', ff);
              }
            });
          }
        );

      }
    }

  }

  protected onFulfilmentCentreSelect() {
    LogUtil.debug('CentreInventoryComponent onFulfilmentCentreSelect');
    this.selectCentreModalDialog.showDialog();
  }

  protected onFulfilmentCentreSelected(event:FormValidationEvent<FulfilmentCentreInfoVO>) {
    LogUtil.debug('CentreInventoryComponent onFulfilmentCentreSelected');
    if (event.valid) {
      this.selectedCentre = event.source;
      CookieUtil.createCookie(CentreInventoryComponent.COOKIE_CENTRE, this.selectedCentre.code, 360);
      this.getFilteredInventory();
    }
  }

  protected onFilterChange(event:any) {

    this.delayedFiltering.delay();

  }

  protected onRefreshHandler() {
    LogUtil.debug('CentreInventoryComponent refresh handler');
    if (UserEventBus.getUserEventBus().current() != null) {
      this.presetFromCookie();
      this.getFilteredInventory();
    }
  }

  protected onInventorySelected(data:InventoryVO) {
    LogUtil.debug('CentreInventoryComponent onInventorySelected', data);
    this.selectedInventory = data;
    this.selectedSkuCode = this.selectedInventory ? this.selectedInventory.skuCode : null;
  }

  protected onInventoryChanged(event:FormValidationEvent<InventoryVO>) {
    LogUtil.debug('CentreInventoryComponent onInventoryChanged', event);
    this.changed = true;
    this.validForSave = event.valid;
    this.inventoryEdit = event.source;
  }

  protected onSearchLow() {
    this.inventoryFilter = '-5';
    this.searchHelpShow = false;
    this.getFilteredInventory();
  }

  protected onSearchReserved() {
    this.inventoryFilter = '+0.001';
    this.searchHelpShow = false;
    this.getFilteredInventory();
  }

  protected onSearchExact() {
    this.inventoryFilter = '!';
    this.searchHelpShow = false;
  }

  protected onForceShowAll() {
    this.forceShowAll = !this.forceShowAll;
    this.getFilteredInventory();
  }

  protected onSearchHelpToggle() {
    this.searchHelpShow = !this.searchHelpShow;
  }

  protected onRowInfoSelected() {
    if (this.selectedInventory != null) {
      this.inventoryInfoDialog.showDialog();
    }
  }

  protected onBackToList() {
    LogUtil.debug('CentreInventoryComponent onBackToList handler');
    if (this.viewMode === CentreInventoryComponent.OFFER) {
      this.inventoryEdit = null;
      this.viewMode = CentreInventoryComponent.OFFERS;
    }
  }

  protected onRowNew() {
    LogUtil.debug('CentreInventoryComponent onRowNew handler');
    this.changed = false;
    this.validForSave = false;
    if (this.viewMode === CentreInventoryComponent.OFFERS) {
      this.inventoryEdit = this.newInventoryInstance();
      this.viewMode = CentreInventoryComponent.OFFER;
    }
    this.selectedInventory = null;
  }

  protected onRowDelete(row:InventoryVO) {
    LogUtil.debug('CentreInventoryComponent onRowDelete handler', row);
    this.deleteValue = row.skuCode;
    this.deleteConfirmationModalDialog.show();
  }

  protected onRowDeleteSelected() {
    if (this.selectedInventory != null) {
      this.onRowDelete(this.selectedInventory);
    }
  }


  protected onRowEditInventory(row:InventoryVO) {
    LogUtil.debug('CentreInventoryComponent onRowEditInventory handler', row);
    this.inventoryEdit = Util.clone(row);
    this.changed = false;
    this.validForSave = false;
    this.viewMode = CentreInventoryComponent.OFFER;
  }

  protected onRowEditSelected() {
    if (this.selectedInventory != null) {
      this.onRowEditInventory(this.selectedInventory);
    }
  }

  protected onSaveHandler() {

    if (this.validForSave && this.changed) {

      if (this.inventoryEdit != null) {

        LogUtil.debug('CentreInventoryComponent Save handler inventory', this.inventoryEdit);

        this.loading = true;
        let _sub:any = this._fulfilmentService.saveInventory(this.inventoryEdit).subscribe(
            rez => {
              _sub.unsubscribe();
              let pk = this.inventoryEdit.skuWarehouseId;
              LogUtil.debug('CentreInventoryComponent inventory changed', rez);
              this.selectedInventory = rez;
              this.validForSave = false;
              this.inventoryEdit = null;
              this.loading = false;
              this.viewMode = CentreInventoryComponent.OFFERS;

              if (pk == 0) {
                this.inventoryFilter = '!' + rez.skuCode;
              }
              this.getFilteredInventory();
          }
        );
      }

    }

  }

  protected onDiscardEventHandler() {
    LogUtil.debug('CentreInventoryComponent discard handler');
    if (this.viewMode === CentreInventoryComponent.OFFER) {
      if (this.selectedInventory != null) {
        this.onRowEditSelected();
      } else {
        this.onRowNew();
      }
    }
  }

  protected onDeleteConfirmationResult(modalresult: ModalResult) {
    LogUtil.debug('CentreInventoryComponent onDeleteConfirmationResult modal result is ', modalresult);
    if (ModalAction.POSITIVE === modalresult.action) {

      if (this.selectedInventory != null) {
        LogUtil.debug('CentreInventoryComponent onDeleteConfirmationResult', this.selectedInventory);

        this.loading = true;
        let _sub:any = this._fulfilmentService.removeInventory(this.selectedInventory).subscribe(res => {
          _sub.unsubscribe();
          LogUtil.debug('CentreInventoryComponent removeInventory', this.selectedInventory);
          this.selectedInventory = null;
          this.inventoryEdit = this.newInventoryInstance();
          this.loading = false;
          this.getFilteredInventory();
        });
      }
    }
  }

  protected onClearFilter() {

    this.inventoryFilter = '';
    this.getFilteredInventory();

  }

  private getFilteredInventory() {
    this.inventoryFilterRequired = !this.forceShowAll && (this.inventoryFilter == null || this.inventoryFilter.length < 2);

    LogUtil.debug('CentreInventoryComponent getFilteredInventory' + (this.forceShowAll ? ' forcefully': ''));

    if (this.selectedCentre != null && !this.inventoryFilterRequired) {
      this.loading = true;
      let max = this.forceShowAll ? this.filterNoCap : this.filterCap;
      let _sub:any = this._fulfilmentService.getFilteredInventory(this.selectedCentre, this.inventoryFilter, max).subscribe( allinventory => {
        LogUtil.debug('CentreInventoryComponent getFilteredInventory', allinventory);
        this.inventory = allinventory;
        this.selectedInventory = null;
        this.inventoryEdit = null;
        this.viewMode = CentreInventoryComponent.OFFERS;
        this.changed = false;
        this.validForSave = false;
        this.inventoryFilterCapped = this.inventory.length >= max;
        this.loading = false;
        _sub.unsubscribe();
      });
    } else {
      this.inventory = [];
      this.selectedInventory = null;
      this.inventoryEdit = null;
      this.viewMode = CentreInventoryComponent.OFFERS;
      this.changed = false;
      this.validForSave = false;
      this.inventoryFilterCapped = false;
    }
  }

}

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
import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CustomValidators } from './../../shared/validation/validators';
import { ProductTypeVO, ProductTypeAttrVO, ProductTypeViewGroupVO, Pair, ValidationRequestVO } from './../../shared/model/index';
import { FormValidationEvent, Futures, Future } from './../../shared/event/index';
import { ProductTypeGroupComponent } from './product-type-group.component';
import { ProductTypeAttributeComponent } from './product-type-attribute.component';
import { UiUtil } from './../../shared/ui/index';
import { LogUtil } from './../../shared/log/index';


@Component({
  selector: 'cw-product-type',
  templateUrl: 'product-type.component.html',
})

export class ProductTypeComponent implements OnInit, OnDestroy {

  @Output() dataChanged: EventEmitter<FormValidationEvent<Pair<ProductTypeVO, Array<Pair<ProductTypeAttrVO, boolean>>>>> = new EventEmitter<FormValidationEvent<Pair<ProductTypeVO, Array<Pair<ProductTypeAttrVO, boolean>>>>>();

  private _productType:ProductTypeVO;
  private _attributes:ProductTypeAttrVO[] = [];
  public attributeFilter:string;

  private _changes:Array<Pair<ProductTypeAttrVO, boolean>>;

  public attributeSelectedRow:ProductTypeAttrVO;
  public groupSelectedRow:ProductTypeViewGroupVO;

  public delayedChange:Future;

  public productTypeForm:any;

  @ViewChild('attributesComponent')
  private attributesComponent:ProductTypeAttributeComponent;
  @ViewChild('groupsComponent')
  private groupsComponent:ProductTypeGroupComponent;

  public searchHelpShow:boolean = false;

  constructor(fb: FormBuilder) {
    LogUtil.debug('ProductTypeComponent constructed');

    let that = this;

    let validCode = function(control:any):any {

      let code = control.value;
      if (code == null || code == '' || that._productType == null || !that.productTypeForm || (!that.productTypeForm.dirty && that._productType.producttypeId > 0)) {
        return null;
      }

      let basic = CustomValidators.validCode36(control);
      if (basic == null) {
        let req:ValidationRequestVO = { subject: 'producttype', subjectId: that._productType.producttypeId, field: 'guid', value: code };
        return CustomValidators.validRemoteCheck(control, req);
      }
      return basic;
    };


    this.productTypeForm = fb.group({
      'guid': ['', validCode],
      'name': [''],
      'description': [''],
      'uitemplate': ['', CustomValidators.noWhitespace255],
      'uisearchtemplate': ['', CustomValidators.noWhitespace255],
      'service': [''],
      'shippable': [''],
      'downloadable': [''],
      'digital': [''],
    });

    this.delayedChange = Futures.perpetual(function() {
      that.formChange();
    }, 200);

  }

  formBind():void {
    UiUtil.formBind(this, 'productTypeForm', 'delayedChange');
  }


  formUnbind():void {
    UiUtil.formUnbind(this, 'productTypeForm');
  }

  formChange():void {
    LogUtil.debug('ProductTypeComponent formChange', this.productTypeForm.valid, this._productType);
    this.dataChanged.emit({ source: new Pair(this._productType, this._changes), valid: this.productTypeForm.valid });
  }

  @Input()
  set productType(productType:ProductTypeVO) {

    UiUtil.formInitialise(this, 'productTypeForm', '_productType', productType);
    this._changes = [];

  }

  get productType():ProductTypeVO {
    return this._productType;
  }

  @Input()
  set attributes(attributes:ProductTypeAttrVO[]) {
    this._attributes = attributes;
  }

  get attributes():ProductTypeAttrVO[] {
    return this._attributes;
  }

  onAttributeDataChanged(event:any) {
    LogUtil.debug('ProductTypeComponent attr data changed', this._productType);
    this._changes = event.source;
    this.delayedChange.delay();
  }

  onGroupDataChanged(event:any) {
    LogUtil.debug('ProductTypeComponent attr data changed', this._productType);
    this.delayedChange.delay();
  }

  onNameDataChange(event:FormValidationEvent<any>) {
    UiUtil.formI18nDataChange(this, 'productTypeForm', 'name', event);
  }

  ngOnInit() {
    LogUtil.debug('ProductTypeComponent ngOnInit');
    this.formBind();
  }

  ngOnDestroy() {
    LogUtil.debug('ProductTypeComponent ngOnDestroy');
    this.formUnbind();
  }

  tabSelected(tab:any) {
    LogUtil.debug('ProductTypeComponent tabSelected', tab);
  }

  onAttributeRowAdd() {
    this.attributesComponent.onRowAdd();
  }

  onAttributeRowDeleteSelected() {
    if (this.attributeSelectedRow != null) {
      this.attributesComponent.onRowDeleteSelected();
    }
  }

  onAttributeRowEditSelected() {
    if (this.attributeSelectedRow != null) {
      this.attributesComponent.onRowEditSelected();
    }
  }

  onAttributeSelectRow(row:ProductTypeAttrVO) {
    LogUtil.debug('ProductTypeComponent onSelectRow handler', row);
    if (row == this.attributeSelectedRow) {
      this.attributeSelectedRow = null;
    } else {
      this.attributeSelectedRow = row;
    }
  }


  onClearFilter() {

    this.attributeFilter = '';

  }

  onSearchHelpToggle() {
    this.searchHelpShow = !this.searchHelpShow;
  }

  onAttributeSearchIndexFilter() {
    this.attributeFilter = '#SI';
    this.searchHelpShow = false;
  }

  onAttributeVisibleFilter() {
    this.attributeFilter = '+V';
    this.searchHelpShow = false;
  }

  onAttributeInvisibleFilter() {
    this.attributeFilter = '-V';
    this.searchHelpShow = false;
  }

  onAttributeChangesFilter() {
    this.attributeFilter = '###';
    this.searchHelpShow = false;
  }

  onGroupRowAdd() {
    this.groupsComponent.onRowAdd();
  }

  onGroupRowDeleteSelected() {
    if (this.groupSelectedRow != null) {
      this.groupsComponent.onRowDeleteSelected();
    }
  }

  onGroupRowEditSelected() {
    if (this.groupSelectedRow != null) {
      this.groupsComponent.onRowEditSelected();
    }
  }


  onGroupSelectRow(row:ProductTypeViewGroupVO) {
    LogUtil.debug('ProductTypeComponent onSelectRow handler', row);
    if (row == this.groupSelectedRow) {
      this.groupSelectedRow = null;
    } else {
      this.groupSelectedRow = row;
    }
  }

}

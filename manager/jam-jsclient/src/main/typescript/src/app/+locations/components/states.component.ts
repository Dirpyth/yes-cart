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
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { StateVO, Pair } from './../../shared/model/index';
import { Futures, Future } from './../../shared/event/index';
import { Config } from './../../../environments/environment';
import { LogUtil } from './../../shared/log/index';

@Component({
  selector: 'cw-states',
  templateUrl: 'states.component.html',
})

export class StatesComponent implements OnInit, OnDestroy {

  @Input() selectedState:StateVO;

  @Output() dataSelected: EventEmitter<StateVO> = new EventEmitter<StateVO>();

  @Output() pageSelected: EventEmitter<number> = new EventEmitter<number>();

  @Output() sortSelected: EventEmitter<Pair<string, boolean>> = new EventEmitter<Pair<string, boolean>>();

  private _states:Array<StateVO> = [];
  private _filter:string;
  private delayedFiltering:Future;
  private delayedFilteringMs:number = Config.UI_INPUT_DELAY;

  public filteredStates:Array<StateVO>;

  //sorting
  public sortColumn:string = 'stateCode';
  public sortDesc:boolean = false;

  //paging
  public maxSize:number = Config.UI_TABLE_PAGE_NUMS;
  public itemsPerPage:number = Config.UI_TABLE_PAGE_SIZE;
  public totalItems:number = 0;
  public currentPage:number = 1;
  // Must use separate variables (not currentPage) for table since that causes
  // cyclic even update and then exception https://github.com/angular/angular/issues/6005
  public pageStart:number = 0;
  public pageEnd:number = this.itemsPerPage;

  constructor() {
    LogUtil.debug('StatesComponent constructed');
    let that = this;
    this.delayedFiltering = Futures.perpetual(function() {
      that.filterStates();
    }, this.delayedFilteringMs);
  }

  ngOnInit() {
    LogUtil.debug('StatesComponent ngOnInit');
  }

  @Input()
  set states(states:Array<StateVO>) {
    this._states = states;
    this.filterStates();
  }

  @Input()
  set filter(filter:string) {
    this._filter = filter ? filter.toLowerCase() : null;
    this.delayedFiltering.delay();
  }

  @Input()
  set sortorder(sort:Pair<string, boolean>) {
    if (sort != null && (sort.first !== this.sortColumn || sort.second !== this.sortDesc)) {
      this.sortColumn = sort.first;
      this.sortDesc = sort.second;
      this.delayedFiltering.delay();
    }
  }

  ngOnDestroy() {
    LogUtil.debug('StatesComponent ngOnDestroy');
    this.selectedState = null;
    this.dataSelected.emit(null);
  }

  resetLastPageEnd() {
    let _pageEnd = this.pageStart + this.itemsPerPage;
    if (_pageEnd > this.totalItems) {
      this.pageEnd = this.totalItems;
    } else {
      this.pageEnd = _pageEnd;
    }
  }

  onPageChanged(event:any) {
    if (this.currentPage != event.page) {
      this.pageSelected.emit(event.page - 1);
    }
    this.pageStart = (event.page - 1) * this.itemsPerPage;
    let _pageEnd = this.pageStart + this.itemsPerPage;
    if (_pageEnd > this.totalItems) {
      this.pageEnd = this.totalItems;
    } else {
      this.pageEnd = _pageEnd;
    }
  }

  onSortClick(event:any) {
    if (event == this.sortColumn) {
      if (this.sortDesc) {  // same column already desc, remove sort
        this.sortColumn = 'stateCode';
        this.sortDesc = false;
      } else {  // same column asc, change to desc
        this.sortColumn = event;
        this.sortDesc = true;
      }
    } else { // different column, start asc sort
      this.sortColumn = event;
      this.sortDesc = false;
    }
    this.filterStates();
    this.sortSelected.emit({ first: this.sortColumn, second: this.sortDesc });
  }

  onSelectRow(row:StateVO) {
    LogUtil.debug('StatesComponent onSelectRow handler', row);
    if (row == this.selectedState) {
      this.selectedState = null;
    } else {
      this.selectedState = row;
    }
    this.dataSelected.emit(this.selectedState);
  }


  private filterStates() {

    if (this._states) {
      if (this._filter) {
        this.filteredStates = this._states.filter(state =>
          state.countryCode.toLowerCase().indexOf(this._filter) !== -1 ||
          state.stateCode.toLowerCase().indexOf(this._filter) !== -1 ||
          state.name.toLowerCase().indexOf(this._filter) !== -1 ||
          state.displayNames && state.displayNames.findIndex(st =>
            st.second.toLowerCase() === this._filter
          ) !== -1
        );
      } else {
        this.filteredStates = this._states.slice(0, this._states.length);
      }
    }

    if (this.filteredStates === null) {
      this.filteredStates = [];
    }

    let _sortProp = this.sortColumn;
    let _sortOrder = this.sortDesc ? -1 : 1;

    let _sort = function(a:any, b:any):number {
      return (a[_sortProp] > b[_sortProp] ? 1 : -1) * _sortOrder;
    };

    this.filteredStates.sort(_sort);

    let _total = this.filteredStates.length;
    this.totalItems = _total;
    if (_total > 0) {
      this.resetLastPageEnd();
    }
  }

}

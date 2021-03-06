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
import { VoDataGroupImpEx } from './../model/index';
import { ImpexService, I18nEventBus, UserEventBus } from './../services/index';
import { UiUtil } from './../ui/index';
import { Futures, Future } from './../event/index';
import { Config } from './../../../environments/environment';

import { LogUtil } from './../log/index';

@Component({
  selector: 'cw-data-group-select',
  templateUrl: 'data-group-select.component.html',
})

export class DataGroupSelectComponent implements OnInit, OnDestroy {

  @Input() mode: string = null;

  @Output() dataSelected: EventEmitter<VoDataGroupImpEx> = new EventEmitter<VoDataGroupImpEx>();

  private groups : VoDataGroupImpEx[] = null;
  public filteredGroups : VoDataGroupImpEx[] = [];
  public groupFilter : string;

  public selectedGroup : VoDataGroupImpEx = null;

  private delayedFiltering:Future;
  private delayedFilteringMs:number = Config.UI_INPUT_DELAY;

  constructor (private _groupService : ImpexService) {
    LogUtil.debug('DataGroupSelectComponent constructed selectedGroup ', this.selectedGroup);
  }

  ngOnDestroy() {
    LogUtil.debug('DataGroupSelectComponent ngOnDestroy');
  }

  ngOnInit() {
    LogUtil.debug('DataGroupSelectComponent ngOnInit');
    if (this.groups == null) {
      this.onRefresh();
    }
    let that = this;
    this.delayedFiltering = Futures.perpetual(function() {
      that.reloadGroupList();
    }, this.delayedFilteringMs);

  }

  onSelectClick(group: VoDataGroupImpEx) {
    LogUtil.debug('DataGroupSelectComponent onSelectClick', group);
    this.selectedGroup = group;
    this.dataSelected.emit(this.selectedGroup);
  }

  onRefresh() {
    if (UserEventBus.getUserEventBus().current() != null) {
      this.dataSelected.emit(null);
      this.getAllGroups();
    }
  }

  onFilterChange() {

    this.delayedFiltering.delay();

  }

  onClearFilter() {
    this.groupFilter = '';
    this.delayedFiltering.delay();
  }

  getGroupName(grp:VoDataGroupImpEx):string {

    if (grp == null) {
      return '';
    }

    let lang = I18nEventBus.getI18nEventBus().current();
    let i18n = grp.displayNames;
    let def = grp.name;

    return UiUtil.toI18nString(i18n, def, lang);

  }


  onDownloadTemplatesClick(grp:VoDataGroupImpEx) {

    LogUtil.debug("DataGroupSelectComponent downloading", grp);

    if (grp != null) {
      this._groupService.downloadTemplates(grp.datagroupId, 'template').subscribe(res => {
        LogUtil.debug("DataGroupSelectComponent downloaded");
      });
    }

  }


  /**
   * Reload list of groups
   */
  private reloadGroupList() {

    if (this.groups != null) {

      if (this.groupFilter) {
        let _filter = this.groupFilter.toLowerCase();
        this.filteredGroups = this.groups.filter(group =>
          group.name.toLowerCase().indexOf(_filter) != -1 ||
          this.getGroupName(group).toLowerCase().indexOf(_filter) !== -1
        );
        LogUtil.debug('DataGroupSelectComponent reloadGroupList filter: ' + _filter, this.filteredGroups);
      } else {
        this.filteredGroups = this.groups;
        LogUtil.debug('DataGroupSelectComponent reloadGroupList no filter', this.filteredGroups);
      }
    }

  }

  private getAllGroups() {

    let _lang = I18nEventBus.getI18nEventBus().current();
    this._groupService.getGroups(_lang, this.mode).subscribe(groups => {

      LogUtil.debug('ImportManagerComponent groups', groups);
      this.groups = groups;
      this.selectedGroup = null;
      this.reloadGroupList();

    });

  }


}

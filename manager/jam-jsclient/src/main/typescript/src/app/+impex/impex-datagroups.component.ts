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
import { DataGroupsService, UserEventBus, Util } from './../shared/services/index';
import { ModalComponent, ModalResult, ModalAction } from './../shared/modal/index';
import { DataGroupVO, Pair } from './../shared/model/index';
import { FormValidationEvent } from './../shared/event/index';
import { LogUtil } from './../shared/log/index';

@Component({
  selector: 'cw-impex-datagroups',
  templateUrl: 'impex-datagroups.component.html',
})

export class ImpexDataGroupsComponent implements OnInit, OnDestroy {

  private static GROUPS:string = 'groups';
  private static GROUP:string = 'group';

  public viewMode:string = ImpexDataGroupsComponent.GROUPS;

  public datagroups:Array<DataGroupVO> = [];
  public datagroupFilter:string;
  public datagroupSort:Pair<string, boolean> = { first: 'name', second: false };

  public selectedDataGroup:DataGroupVO;

  public datagroupEdit:DataGroupVO;

  @ViewChild('deleteConfirmationModalDialog')
  private deleteConfirmationModalDialog:ModalComponent;

  public deleteValue:String;

  public loading:boolean = false;

  public changed:boolean = false;
  public validForSave:boolean = false;

  constructor(private _dataDroupService:DataGroupsService) {
    LogUtil.debug('ImpexDataGroupsComponent constructed');
  }

  newDataGroupInstance():DataGroupVO {
    return {
      datagroupId: 0, name: '', qualifier: '', type: 'IMPORT', descriptors: '', displayNames: []
    };
  }

  ngOnInit() {
    LogUtil.debug('ImpexDataGroupsComponent ngOnInit');
    this.onRefreshHandler();
  }

  ngOnDestroy() {
    LogUtil.debug('ImpexDataGroupsComponent ngOnDestroy');
  }

  onRefreshHandler() {
    LogUtil.debug('ImpexDataGroupsComponent refresh handler');
    if (UserEventBus.getUserEventBus().current() != null) {
      this.getAllDataGroups();
    }
  }

  onPageSelected(page:number) {
    LogUtil.debug('ImpexDataGroupsComponent onPageSelected', page);
  }

  onSortSelected(sort:Pair<string, boolean>) {
    LogUtil.debug('ImpexDataGroupsComponent ononSortSelected', sort);
    if (sort == null) {
      this.datagroupSort = { first: 'name', second: false };
    } else {
      this.datagroupSort = sort;
    }
  }

  onDataGroupSelected(data:DataGroupVO) {
    LogUtil.debug('ImpexDataGroupsComponent onDataGroupSelected', data);
    this.selectedDataGroup = data;
  }

  onDataGroupChanged(event:FormValidationEvent<DataGroupVO>) {
    LogUtil.debug('ImpexDataGroupsComponent onDataGroupChanged', event);
    this.changed = true;
    this.validForSave = event.valid;
    this.datagroupEdit = event.source;
  }

  onBackToList() {
    LogUtil.debug('ImpexDataGroupsComponent onBackToList handler');
    if (this.viewMode === ImpexDataGroupsComponent.GROUP) {
      this.datagroupEdit = null;
      this.changed = false;
      this.validForSave = false;
      this.viewMode = ImpexDataGroupsComponent.GROUPS;
    }
  }

  onRowNew() {
    LogUtil.debug('ImpexDataGroupsComponent onRowNew handler');
    this.changed = false;
    this.validForSave = false;
    if (this.viewMode === ImpexDataGroupsComponent.GROUPS) {
      this.datagroupEdit = this.newDataGroupInstance();
      this.viewMode = ImpexDataGroupsComponent.GROUP;
    }
  }

  onRowDelete(row:any) {
    LogUtil.debug('ImpexDataGroupsComponent onRowDelete handler', row);
    this.deleteValue = row.name;
    this.deleteConfirmationModalDialog.show();
  }

  onRowDeleteSelected() {
    if (this.selectedDataGroup != null) {
      this.onRowDelete(this.selectedDataGroup);
    }
  }

  onRowEditDataGroup(row:DataGroupVO) {
    LogUtil.debug('ImpexDataGroupsComponent onRowEditDataGroup handler', row);
    this.datagroupEdit = Util.clone(row);
    this.changed = false;
    this.validForSave = false;
    this.viewMode = ImpexDataGroupsComponent.GROUP;
  }

  onRowEditSelected() {
    if (this.selectedDataGroup != null) {
      this.onRowEditDataGroup(this.selectedDataGroup);
    }
  }

  onSaveHandler() {

    if (this.validForSave && this.changed) {

      if (this.datagroupEdit != null) {

        LogUtil.debug('ImpexDataGroupsComponent Save handler datagroup', this.datagroupEdit);

        this.loading = true;
        this._dataDroupService.saveDataGroup(this.datagroupEdit).subscribe(
          rez => {
            if (this.datagroupEdit.datagroupId > 0) {
              let idx = this.datagroups.findIndex(rez => rez.datagroupId == this.datagroupEdit.datagroupId);
              if (idx !== -1) {
                this.datagroups[idx] = rez;
                this.datagroups = this.datagroups.slice(0, this.datagroups.length); // reset to propagate changes
                LogUtil.debug('ImpexDataGroupsComponent datagroup changed', rez);
              }
            } else {
              this.datagroups.push(rez);
              LogUtil.debug('ImpexDataGroupsComponent datagroup added', rez);
            }
            this.changed = false;
            this.validForSave = false;
            this.selectedDataGroup = rez;
            this.datagroupEdit = null;
            this.loading = false;
            this.viewMode = ImpexDataGroupsComponent.GROUPS;
          }
        );
      }

    }

  }

  onDiscardEventHandler() {
    LogUtil.debug('ImpexDataGroupsComponent discard handler');
    if (this.viewMode === ImpexDataGroupsComponent.GROUP) {
      if (this.selectedDataGroup != null) {
        this.onRowEditSelected();
      } else {
        this.onRowNew();
      }
    }
  }

  onDeleteConfirmationResult(modalresult: ModalResult) {
    LogUtil.debug('ImpexDataGroupsComponent onDeleteConfirmationResult modal result is ', modalresult);
    if (ModalAction.POSITIVE === modalresult.action) {

      if (this.selectedDataGroup != null) {
        LogUtil.debug('ImpexDataGroupsComponent onDeleteConfirmationResult', this.selectedDataGroup);

        this.loading = true;
        this._dataDroupService.removeDataGroup(this.selectedDataGroup).subscribe(res => {
          LogUtil.debug('ImpexDataGroupsComponent removeDataGroup', this.selectedDataGroup);
          let idx = this.datagroups.indexOf(this.selectedDataGroup);
          this.datagroups.splice(idx, 1);
          this.datagroups = this.datagroups.slice(0, this.datagroups.length); // reset to propagate changes
          this.selectedDataGroup = null;
          this.changed = false;
          this.validForSave = false;
          this.datagroupEdit = null;
          this.loading = false;
          this.viewMode = ImpexDataGroupsComponent.GROUPS;
        });
      }
    }
  }

  onClearFilterDataGroup() {

    this.datagroupFilter = '';

  }
  onDownloadHandler() {
    LogUtil.debug('ImpexDataGroupsComponent download handler');
    if (this.selectedDataGroup != null) {
      this._dataDroupService.downloadTemplates(this.selectedDataGroup.datagroupId, 'template').subscribe(res => {
        LogUtil.debug("ImpexDataGroupsComponent downloaded");
      });
    }
  }


  private getAllDataGroups() {
    this.loading = true;
    this._dataDroupService.getAllDataGroups().subscribe( alldatagroups => {
      LogUtil.debug('ImpexDataGroupsComponent getAllDataGroups', alldatagroups);
      this.datagroups = alldatagroups;
      this.selectedDataGroup = null;
      this.datagroupEdit = null;
      this.viewMode = ImpexDataGroupsComponent.GROUPS;
      this.changed = false;
      this.validForSave = false;
      this.loading = false;
    });
  }

}

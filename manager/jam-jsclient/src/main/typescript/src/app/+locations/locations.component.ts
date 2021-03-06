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
import { LocationService, UserEventBus, Util } from './../shared/services/index';
import { ModalComponent, ModalResult, ModalAction } from './../shared/modal/index';
import { CountryInfoVO, CountryVO, StateVO, Pair, SearchResultVO } from './../shared/model/index';
import { FormValidationEvent, Futures, Future } from './../shared/event/index';
import { Config } from './../../environments/environment';
import { LogUtil } from './../shared/log/index';

@Component({
  selector: 'cw-locations',
  templateUrl: 'locations.component.html',
})

export class LocationsComponent implements OnInit, OnDestroy {

  private static COUNTRIES:string = 'countries';
  private static COUNTRY:string = 'country';
  private static STATE:string = 'state';

  public viewMode:string = LocationsComponent.COUNTRIES;

  public countries:SearchResultVO<CountryInfoVO>;
  public countryFilter:string;

  private delayedFilteringCountry:Future;
  private delayedFilteringCountryMs:number = Config.UI_INPUT_DELAY;

  public selectedCountry:CountryVO;

  public countryEdit:CountryVO;

  @ViewChild('deleteConfirmationModalDialog')
  private deleteConfirmationModalDialog:ModalComponent;

  public selectedState:StateVO;

  public stateEdit:StateVO;

  public deleteValue:String;

  public loading:boolean = false;

  public changed:boolean = false;
  public validForSave:boolean = false;

  constructor(private _locationService:LocationService) {
    LogUtil.debug('LocationsComponent constructed');
    this.countries = this.newSearchResultCountryInstance();
  }

  newCountryInstance():CountryVO {
    return {
      countryId: 0,
      countryCode: '',
      isoCode: '',
      name: '',
      displayNames: [],
      states: []
    };
  }

  newSearchResultCountryInstance():SearchResultVO<CountryInfoVO> {
    return {
      searchContext: {
        parameters: {
          filter: []
        },
        start: 0,
        size: Config.UI_TABLE_PAGE_SIZE,
        sortBy: null,
        sortDesc: false
      },
      items: [],
      total: 0
    };
  }

  newStateInstance():StateVO {
    let country = this.selectedCountry != null ? this.selectedCountry.countryCode : '';
    return {
      stateId: 0,
      countryCode: country,
      stateCode: '',
      name: '',
      displayNames: []
    };
  }

  ngOnInit() {
    LogUtil.debug('LocationsComponent ngOnInit');
    this.onRefreshHandler();
    let that = this;
    this.delayedFilteringCountry = Futures.perpetual(function() {
      that.getFilteredCountires();
    }, this.delayedFilteringCountryMs);
  }

  ngOnDestroy() {
    LogUtil.debug('LocationsComponent ngOnDestroy');
  }


  onCountryFilterChange(event:any) {
    this.countries.searchContext.start = 0; // changing filter means we need to start from first page
    this.delayedFilteringCountry.delay();
  }

  onRefreshHandler() {
    LogUtil.debug('LocationsComponent refresh handler');
    if (UserEventBus.getUserEventBus().current() != null) {
      this.getFilteredCountires();
    }
  }

  onPageSelected(page:number) {
    LogUtil.debug('LocationsComponent onPageSelected', page);
    this.countries.searchContext.start = page;
    this.delayedFilteringCountry.delay();
  }

  onSortSelected(sort:Pair<string, boolean>) {
    LogUtil.debug('LocationsComponent ononSortSelected', sort);
    if (sort == null) {
      this.countries.searchContext.sortBy = null;
      this.countries.searchContext.sortDesc = false;
    } else {
      this.countries.searchContext.sortBy = sort.first;
      this.countries.searchContext.sortDesc = sort.second;
    }
    this.delayedFilteringCountry.delay();
  }

  onCountrySelected(data:CountryVO) {
    LogUtil.debug('LocationsComponent onCountrySelected', data);
    this.selectedCountry = data;
  }

  onCountryChanged(event:FormValidationEvent<CountryVO>) {
    LogUtil.debug('LocationsComponent onCountryChanged', event);
    this.changed = true;
    this.validForSave = event.valid;
    this.countryEdit = event.source;
  }

  onStateSelected(data:StateVO) {
    LogUtil.debug('LocationsComponent onStateSelected', data);
    this.selectedState = data;
  }

  onStateAdd(data:StateVO) {
    LogUtil.debug('LocationsComponent onStateAdd', data);
    this.onRowNew();
  }

  onStateEdit(data:StateVO) {
    LogUtil.debug('LocationsComponent onStateEdit', data);
    this.onRowEditState(data);
  }

  onStateDelete(data:StateVO) {
    LogUtil.debug('LocationsComponent onStateDelete', data);
    this.selectedState = data;
    this.onRowDelete(data);
  }

  onStateChanged(event:FormValidationEvent<StateVO>) {
    LogUtil.debug('LocationsComponent onStateChanged', event);
    this.changed = true;
    this.validForSave = event.valid;
    this.stateEdit = event.source;
  }

  onBackToList() {
    LogUtil.debug('LocationsComponent onBackToList handler');
    if (this.viewMode === LocationsComponent.STATE) {
      this.stateEdit = null;
      if (this.countryEdit != null) {
        this.viewMode = LocationsComponent.COUNTRY;
      }
    } else if (this.viewMode === LocationsComponent.COUNTRY) {
      this.countryEdit = null;
      this.stateEdit = null;
      this.selectedState = null;
      this.viewMode = LocationsComponent.COUNTRIES;
    }
  }

  onRowNew() {
    LogUtil.debug('LocationsComponent onRowNew handler');
    this.changed = false;
    this.validForSave = false;
    if (this.viewMode === LocationsComponent.COUNTRIES) {
      this.countryEdit = this.newCountryInstance();
      this.viewMode = LocationsComponent.COUNTRY;
    } else if (this.viewMode === LocationsComponent.COUNTRY) {
      this.stateEdit = this.newStateInstance();
      this.viewMode = LocationsComponent.STATE;
    }
  }

  onRowDelete(row:any) {
    LogUtil.debug('LocationsComponent onRowDelete handler', row);
    this.deleteValue = row.name;
    this.deleteConfirmationModalDialog.show();
  }

  onRowDeleteSelected() {
    if (this.selectedState != null) {
      this.onRowDelete(this.selectedState);
    } else if (this.selectedCountry != null) {
      this.onRowDelete(this.selectedCountry);
    }
  }


  onRowEditCountry(row:CountryInfoVO) {
    LogUtil.debug('LocationsComponent onRowEditCountry handler', row);
    this.loading = true;
    this._locationService.getCountryById(row.countryId).subscribe(res => {
      LogUtil.debug('LocationsComponent getCountryById', res);
      this.countryEdit = res;
      this.changed = false;
      this.validForSave = false;
      this.viewMode = LocationsComponent.COUNTRY;
      this.loading = false;
    });
  }

  onRowEditState(row:StateVO) {
    LogUtil.debug('LocationsComponent onRowEditState handler', row);
    this.stateEdit = Util.clone(row);
    this.changed = false;
    this.validForSave = false;
    this.viewMode = LocationsComponent.STATE;
  }

  onRowEditSelected() {
    if (this.selectedState != null) {
      this.onRowEditState(this.selectedState);
    } else if (this.selectedCountry != null) {
      this.onRowEditCountry(this.selectedCountry);
    }
  }


  onSaveHandler() {

    if (this.validForSave && this.changed) {

      if (this.stateEdit != null) {

        LogUtil.debug('LocationsComponent Save handler state', this.stateEdit);

        this.loading = true;
        this._locationService.saveState(this.stateEdit).subscribe(
            rez => {
              let pk = this.stateEdit.stateId;
              if (pk > 0) {
                LogUtil.debug('LocationsComponent state edit', rez);
                if (this.countryEdit != null) {
                  let idx = this.countryEdit.states.findIndex(rez => rez.stateId == pk);
                  if (idx !== -1) {
                    this.countryEdit.states[idx] = rez;
                    this.countryEdit.states = this.countryEdit.states.slice(0, this.countryEdit.states.length); // reset to propagate changes
                  }
                }
              } else {
                if (this.countryEdit != null) {
                  this.countryEdit.states.push(rez);
                  this.countryEdit.states = this.countryEdit.states.slice(0, this.countryEdit.states.length); // reset to propagate changes
                }
                LogUtil.debug('LocationsComponent state added', rez);
              }
              this.changed = false;
              this.selectedState = rez;
              this.stateEdit = null;
              this.loading = false;
              this.viewMode = LocationsComponent.COUNTRY;
          }
        );
      } else if (this.countryEdit != null) {

        LogUtil.debug('LocationsComponent Save handler country', this.countryEdit);

        this.loading = true;
        this._locationService.saveCountry(this.countryEdit).subscribe(
            rez => {
              LogUtil.debug('LocationsComponent country changed', rez);
              this.changed = false;
              this.selectedCountry = rez;
              this.selectedState = null;
              this.countryEdit = null;
              this.loading = false;
              this.getFilteredCountires();
          }
        );
      }

    }

  }

  onDiscardEventHandler() {
    LogUtil.debug('LocationsComponent discard handler');
    if (this.viewMode === LocationsComponent.STATE) {
      if (this.selectedState != null) {
        this.onRowEditState(this.selectedState);
      } else {
        this.onRowNew();
      }
    }
    if (this.viewMode === LocationsComponent.COUNTRY) {
      if (this.selectedCountry != null) {
        this.onRowEditCountry(this.selectedCountry);
      } else {
        this.onRowNew();
      }
    }
  }

  onDeleteConfirmationResult(modalresult: ModalResult) {
    LogUtil.debug('LocationsComponent onDeleteConfirmationResult modal result is ', modalresult);
    if (ModalAction.POSITIVE === modalresult.action) {

      if (this.selectedState != null) {
        LogUtil.debug('LocationsComponent onDeleteConfirmationResult', this.selectedState);

        this.loading = true;
        this._locationService.removeState(this.selectedState).subscribe(res => {
          LogUtil.debug('LocationsComponent removeState', this.selectedState);
          let pk = this.selectedState.stateId;
          this.stateEdit = null;
          if (this.countryEdit != null) {
            let idx2 = this.countryEdit.states.findIndex(rez => rez.stateId == pk);
            if (idx2 !== -1) {
              this.countryEdit.states.splice(idx2, 1);
              this.countryEdit.states = this.countryEdit.states.slice(0, this.countryEdit.states.length); // reset to propagate changes
            }
          }
          this.selectedState = null;
          this.loading = false;
          this.viewMode = LocationsComponent.COUNTRY;
        });

      } else if (this.selectedCountry != null) {
        LogUtil.debug('LocationsComponent onDeleteConfirmationResult', this.selectedCountry);

        this.loading = true;
        this._locationService.removeCountry(this.selectedCountry).subscribe(res => {
          LogUtil.debug('LocationsComponent removeCountry', this.selectedCountry);
          this.selectedCountry = null;
          this.countryEdit = null;
          this.loading = false;
          this.getFilteredCountires();
        });
      }
    }
  }

  onClearFilterCountry() {

    this.countryFilter = '';
    this.getFilteredCountires();

  }

  private getFilteredCountires() {

    LogUtil.debug('LocationsComponent getFilteredCountires');

    this.loading = true;

    this.countries.searchContext.parameters.filter = [ this.countryFilter ];
    this.countries.searchContext.size = Config.UI_TABLE_PAGE_SIZE;

    this._locationService.getFilteredCountries(this.countries.searchContext).subscribe( allcountries => {
      LogUtil.debug('LocationsComponent getAllCountries', allcountries);
      this.countries = allcountries;
      this.selectedCountry = null;
      this.countryEdit = null;
      this.viewMode = LocationsComponent.COUNTRIES;
      this.changed = false;
      this.validForSave = false;
      this.loading = false;
    });
  }

}

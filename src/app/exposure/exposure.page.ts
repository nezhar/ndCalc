import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exposure',
  templateUrl: 'exposure.page.html',
  styleUrls: ['exposure.page.scss']
})
export class ExposurePage implements OnInit, OnDestroy {

  pageForm: FormGroup;

  exposureValues: {seconds: number, division: number, value?: number, display?: string}[] = [
    {seconds: 1, division: 8000},
    {seconds: 1, division: 6400},
    {seconds: 1, division: 5000},
    {seconds: 1, division: 4000},
    {seconds: 1, division: 3200},
    {seconds: 1, division: 2500},
    {seconds: 1, division: 2000},
    {seconds: 1, division: 1600},
    {seconds: 1, division: 1250},
    {seconds: 1, division: 1000},
    {seconds: 1, division: 800},
    {seconds: 1, division: 640},
    {seconds: 1, division: 500},
    {seconds: 1, division: 400},
    {seconds: 1, division: 320},
    {seconds: 1, division: 250},
    {seconds: 1, division: 200},
    {seconds: 1, division: 160},
    {seconds: 1, division: 125},
    {seconds: 1, division: 100},
    {seconds: 1, division: 80},
    {seconds: 1, division: 60},
    {seconds: 1, division: 50},
    {seconds: 1, division: 40},
    {seconds: 1, division: 30},
    {seconds: 1, division: 25},
    {seconds: 1, division: 20},
    {seconds: 1, division: 15},
    {seconds: 1, division: 13},
    {seconds: 1, division: 10},
    {seconds: 1, division: 8},
    {seconds: 1, division: 6},
    {seconds: 1, division: 5},
    {seconds: 1, division: 4},
    {seconds: 0.3, division: 1},
    {seconds: 0.4, division: 1},
    {seconds: 0.5, division: 1},
    {seconds: 0.6, division: 1},
    {seconds: 0.8, division: 1},
    {seconds: 1, division: 1},
    {seconds: 1.3, division: 1},
    {seconds: 1.6, division: 1},
    {seconds: 2, division: 1},
    {seconds: 2.5, division: 1},
    {seconds: 3.2, division: 1},
    {seconds: 4, division: 1},
    {seconds: 5, division: 1},
    {seconds: 6, division: 1},
    {seconds: 8, division: 1},
    {seconds: 10, division: 1},
    {seconds: 13, division: 1},
    {seconds: 15, division: 1},
    {seconds: 20, division: 1},
    {seconds: 25, division: 1},
    {seconds: 30, division: 1},
  ];
  stopValues: {value: number, display: string}[] = [
    {value: 0, display: 'no stops / ND 1'},
    {value: 1, display: '1 Stop / ND2'},
    {value: 2, display: '2 Stop / ND4'},
    {value: 3, display: '3 Stop / ND8'},
    {value: 4, display: '4 Stop / ND16'},
    {value: 5, display: '5 Stop / ND32'},
    {value: 6, display: '6 Stop / ND64'},
    {value: 7, display: '7 Stop / ND128'},
    {value: 8, display: '8 Stop / ND256'},
    {value: 9, display: '9 Stop / ND510'},
    {value: 10, display: '10 Stop / ND1024'},
    {value: 11, display: '11 Stop / ND2048'},
    {value: 12, display: '12 Stop / ND4096'},
    {value: 13, display: '13 Stop / ND8192'},
  ];

  finalExposure: string;
  exposureDisplay = '';
  stopsDisplay = '';

  finalExposureSubscription: Subscription;

  constructor() {}

  ngOnInit() {

    for (const exposureValue of this.exposureValues) {
      exposureValue.value = exposureValue.seconds / exposureValue.division;

      if (exposureValue.division > 1) {
        exposureValue.display = `${exposureValue.seconds}/${exposureValue.division}s`;
      } else {
        exposureValue.display = `${exposureValue.seconds}s`;
      }
    }

    this.pageForm = new FormGroup({
      exposure: new FormControl(this.exposureValues[0].value),
      stops: new FormControl(this.stopValues[0].value),
    });

    this.exposureDisplay = this.getDisplayValue(this.exposureValues, this.pageForm.get('exposure').value);
    this.stopsDisplay = this.getDisplayValue(this.stopValues, this.pageForm.get('stops').value);
    this.finalExposure = this.getFinalExposureDisplay(this.pageForm.get('exposure').value, this.pageForm.get('stops').value);

    this.setDisplayValues(this.pageForm.value);
    this.finalExposureSubscription = this.pageForm.valueChanges.subscribe(value => {
      this.setDisplayValues(value);
    });

  }

  getDisplayValue(list: {value?: any, display?: string}[], value: any) {
      return list.find(element => element.value === value).display;
  }

  getFinalExposureDisplay(exposure: number, stops: number) {
    const value = exposure * Math.pow(2, stops);

    if (value < 1) {
      return this.exposureValues.reduce((prev, curr) => {
        return (Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev);
      }).display;
    } else {
      return this.secondsToHms(value);
    }

    return `${value}s`;
  }

  setDisplayValues(formValue) {
    this.exposureDisplay = this.getDisplayValue(this.exposureValues, formValue.exposure);
    this.stopsDisplay = this.getDisplayValue(this.stopValues, formValue.stops);
    this.finalExposure = this.getFinalExposureDisplay(formValue.exposure, formValue.stops);
  }

  secondsToHms(value: number) {
    const h = Math.floor(value / 3600);
    const m = Math.floor(value % 3600 / 60);
    const s = Math.floor(value % 3600 % 60);

    let result = h > 0 ? h + 'h' : '';
    result += (m > 0 && result !== '') ? ' ' : '';
    result += m > 0 ? m + 'm' : '';
    result += (s > 0 && result !== '') ? ' ' : '';
    result += s > 0 ? s + 's' : '';

    return result;
}

  ngOnDestroy() {
    this.finalExposureSubscription.unsubscribe();
  }

}

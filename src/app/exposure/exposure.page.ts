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

  exposureValues: {value: number, display: string}[] = [
    {value: 0.000125, display: '1/8000s'},
    {value: 0.00025, display: '1/4000s'},
    {value: 0.0005, display: '1/2000s'},
    {value: 0.001, display: '1/1000s'},
    {value: 0.002, display: '1/500s'},
    {value: 0.004, display: '1/250s'},
    {value: 0.008, display: '1/125s'},
    {value: 0.01666666666, display: '1/60s'},
    {value: 0.03333333333, display: '1/30s'},
    {value: 0.06666666666, display: '1/15s'},
    {value: 0.125, display: '1/8s'},
    {value: 0.25, display: '1/4s'},
    {value: 0.5, display: '1/2s'},
    {value: 1, display: '1s'},
    {value: 2, display: '2s'},
    {value: 4, display: '4s'},
    {value: 8, display: '8s'},
    {value: 15, display: '15s'},
    {value: 30, display: '30s'},
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

  getDisplayValue(list: {value: any, display: string}[], value: any) {
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

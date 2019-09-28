import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExposurePage } from './exposure.page';

describe('ExposurePage', () => {
  let component: ExposurePage;
  let fixture: ComponentFixture<ExposurePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExposurePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExposurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

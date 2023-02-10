import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatteringComponent } from './wattering.component';

describe('WatteringComponent', () => {
  let component: WatteringComponent;
  let fixture: ComponentFixture<WatteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatteringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

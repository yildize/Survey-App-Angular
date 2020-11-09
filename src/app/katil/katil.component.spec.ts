import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KatilComponent } from './katil.component';

describe('KatilComponent', () => {
  let component: KatilComponent;
  let fixture: ComponentFixture<KatilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KatilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KatilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

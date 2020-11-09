import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GorComponent } from './gor.component';

describe('GorComponent', () => {
  let component: GorComponent;
  let fixture: ComponentFixture<GorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

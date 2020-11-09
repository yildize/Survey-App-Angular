import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YaratComponent } from './yarat.component';

describe('YaratComponent', () => {
  let component: YaratComponent;
  let fixture: ComponentFixture<YaratComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YaratComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YaratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

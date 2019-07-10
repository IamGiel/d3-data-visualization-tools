import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTooltipComponentComponent } from './my-tooltip-component.component';

describe('MyTooltipComponentComponent', () => {
  let component: MyTooltipComponentComponent;
  let fixture: ComponentFixture<MyTooltipComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTooltipComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTooltipComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

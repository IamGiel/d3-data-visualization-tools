import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterPlotAnimatedComponent } from './scatter-plot-animated.component';

describe('ScatterPlotAnimatedComponent', () => {
  let component: ScatterPlotAnimatedComponent;
  let fixture: ComponentFixture<ScatterPlotAnimatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScatterPlotAnimatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterPlotAnimatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

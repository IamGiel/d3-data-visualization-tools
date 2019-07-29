import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { D3TooltipModule, D3TooltipService } from 'ngx-d3-tooltip';


import { AppComponent } from './app.component';
import { environment, environment2 } from 'src/environments/environment';
import { MyTooltipComponentComponent } from './my-tooltip-component/my-tooltip-component.component';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { ScatterPlotAnimatedComponent } from './scatter-plot-animated/scatter-plot-animated.component';
import { DropdownMenuComponent } from './scatter-plot-animated/dropdown-menu/dropdown-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    MyTooltipComponentComponent,
    ScatterPlotComponent,
    BarChartComponent,
    HeatMapComponent,
    ScatterPlotAnimatedComponent,
    DropdownMenuComponent
  ],
  imports: [
    BrowserModule,
    D3TooltipModule,
    AngularFireModule.initializeApp(environment.firebase, environment2.firebase),
    AngularFirestoreModule,
  ],
  providers: [D3TooltipService],
  bootstrap: [AppComponent]
})
export class AppModule { }

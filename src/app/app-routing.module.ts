import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YaratComponent } from './yarat/yarat.component';
import { KatilComponent } from './katil/katil.component';
import { GorComponent } from './gor/gor.component';


const routes: Routes = [
  { path: '', component: KatilComponent},
  { path: 'create', component: YaratComponent},
  { path: 'join', component: KatilComponent},
  { path: 'look', component: GorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

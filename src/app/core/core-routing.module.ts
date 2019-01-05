import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LibraryComponent } from '../features/library/library.component';

const routes: Routes = [
  { path: 'library', component: LibraryComponent },
  { path: '', pathMatch: 'full', redirectTo: 'library' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

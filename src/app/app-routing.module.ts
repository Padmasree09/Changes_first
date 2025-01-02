import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route redirects to login
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'home', component: HomeComponent }, // Home route
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

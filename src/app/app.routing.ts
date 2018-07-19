import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import {ErrorComponent} from './error/error.component'
import {AuthGuard} from './Auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WatchListComponent } from './watch-list/watch-list.component';

export const AppRoutes: Routes = [
	{
		path: '', 
		component: MainComponent, 
		canActivate: [AuthGuard],
		children: [
			{ path:'dashboard', component: DashboardComponent},
			{ path:'', redirectTo: '/dashboard', pathMatch: 'full'},
			{ path:'watchlist', component: WatchListComponent}
		]
	},
	{ path: 'login', component: LoginComponent },
	{ path: '**', component: ErrorComponent }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
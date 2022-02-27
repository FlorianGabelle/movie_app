import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http' ;
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { FrameworkComponent } from './framework/framework.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    FrameworkComponent,
    MovieListComponent,
    WatchlistComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: WelcomeComponent
      },
      {
        path: 'watchlist',
        component: WatchlistComponent
      },
      {
        path: 'discoverMovie/:genre/:page_number',
        component: MovieListComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [FrameworkComponent]
})
export class AppModule { }

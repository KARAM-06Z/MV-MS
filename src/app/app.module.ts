import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from "../environments/environment"

import { AppComponent } from './app.component';
import { HeaderComponent } from './Aditional/components/header/header.component';
import { LogInComponent } from './log-in/log-in.component';
import { appService } from './app.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromApp from "./store/app.reducer";
import { authEffects } from './Authentication/store/auth.effects';
import { dropdownDirective } from './Aditional/directives/dropdown.directive';
import { MainComponent } from './main/main.component';
import { StoreComponent } from './main/store/store.component';
import { appRoutingModule } from './app-routing.module';
import { authGuard } from './Authentication/Additional/authGuard';
import { CreateComponent } from './main/create/create.component';
import { authInterceptorService } from './Authentication/Additional/auth.interceptor';
import { storeEffects } from './main/store/store/store.effects';
import { ProductComponent } from './main/product/product.component';
import { DeleteComponent } from './main/product/delete/delete.component';
import { HeaderDropdownComponent } from './Aditional/components/dropdowns/header-dropdown/header-dropdown.component';
import { headerDropdownService } from './Aditional/components/dropdowns/header-dropdown/header-dropdown.service';
import { SortDropdownComponent } from './Aditional/components/dropdowns/sort-dropdown/sort-dropdown.component';
import { sortDropdownService } from './Aditional/components/dropdowns/sort-dropdown/sort-dropdown.service';
import { FooterComponent } from './Aditional/components/footer/footer.component';
import { SearchComponent } from './main/store/search/search.component';
import { searchService } from './main/store/search/searchService';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LogInComponent,
    dropdownDirective,
    MainComponent,
    StoreComponent,
    CreateComponent,
    ProductComponent,
    DeleteComponent,
    HeaderDropdownComponent,
    SortDropdownComponent,
    FooterComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    appRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([authEffects,storeEffects]),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireDatabaseModule
  ],
  providers: [
    appService,
    headerDropdownService,
    sortDropdownService,
    searchService,
    authGuard,
    {provide : HTTP_INTERCEPTORS , useClass : authInterceptorService , multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

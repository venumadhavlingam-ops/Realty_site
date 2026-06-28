import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
 import { FooterComponent } from './components/footer/footer';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent,FooterComponent],
  template: `
    <app-header></app-header>
    <main class="min-h-screen pt-20">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class AppComponent implements OnInit {
  ngOnInit() {
    register(); // Register Swiper Web Components
  }
}
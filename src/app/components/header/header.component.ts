import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="fixed top-0 w-full z-50 glass transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <a routerLink="/" class="text-2xl font-heading font-bold text-primary flex items-center gap-2">
            <span class="text-accent">Luxury</span>Estates
          </a>
          
          <nav class="hidden md:flex space-x-8 font-medium">
            <a routerLink="/" class="hover:text-accent transition-colors">Home</a>
            <a routerLink="/properties" class="hover:text-accent transition-colors">Properties</a>
            <a routerLink="/about" class="hover:text-accent transition-colors">About</a>
            <a routerLink="/contact" class="hover:text-accent transition-colors">Contact</a>
          </nav>

          <div class="hidden md:flex items-center space-x-4">
            <button class="px-6 py-2 rounded-full border border-primary hover:bg-primary hover:text-white transition-all">Call Us</button>
            <button class="px-6 py-2 rounded-full bg-success text-white hover:bg-green-600 transition-all shadow-lg">WhatsApp</button>
          </div>
          
          <button (click)="toggleMenu()" class="md:hidden text-primary p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
      
      <div *ngIf="isMenuOpen()" class="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-xl">
        <a routerLink="/" class="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50">Home</a>
        <a routerLink="/properties" class="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50">Properties</a>
      </div>
    </header>
  `
})
export class HeaderComponent {
  isMenuOpen = signal(false);
  toggleMenu() { this.isMenuOpen.update(v => !v); }
}
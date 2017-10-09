import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  theme: boolean = false;
  
  toggleTheme() {
    this.theme = !this.theme;
  }
}

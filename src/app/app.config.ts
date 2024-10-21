import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import{AngularFireModule} from '@angular/fire/compat'
import{AngularFireAuthModule,AngularFireAuth} from '@angular/fire/compat/auth'
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';


const firebaseConfig = {
  apiKey: "AIzaSyCWwlpnAlWszxCRgU3Sh5Y8pQbZOoQn5OU",
  authDomain: "e-commerce-efdf0.firebaseapp.com",
  projectId: "e-commerce-efdf0",
  storageBucket: "e-commerce-efdf0.appspot.com",
  messagingSenderId: "442217784507",
  appId: "1:442217784507:web:75a53255fdefae5a5e759e",
  measurementId: "G-12CM6T2H50"
};

export const appConfig: ApplicationConfig = {
 
 
  
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),provideHttpClient()
    , importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
    importProvidersFrom(AngularFireAuth),
    importProvidersFrom(AngularFireAuthModule),

      
  ]


 






};

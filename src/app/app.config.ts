import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import{AngularFireModule} from '@angular/fire/compat'
import{AngularFireAuthModule,AngularFireAuth} from '@angular/fire/compat/auth'
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { FirebaseApp, provideFirebaseApp } from '@angular/fire/app';


import {Firestore, provideFirestore} from '@angular/fire/firestore' ;
import { AuthInterceptor } from './auth-interceptor';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

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
   
    ,
    

    provideFirestore(() => getFirestore()), 

    
    provideZoneChangeDetection({ eventCoalescing: true }),
   
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    
    importProvidersFrom(FirebaseApp),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    
   
     importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
    importProvidersFrom(AngularFireAuth),
    importProvidersFrom(AngularFireAuthModule),
   
    
    
    
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    },
    
    

      
  ]


 






};

import { Routes } from '@angular/router';
import { ListProductsComponent } from './list-products/list-products.component';
import { PanierComponent } from './panier/panier.component';
import { DetailsProduitComponent } from './details-produit/details-produit.component';
import { AuthComponent } from './auth/auth.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthGuardService } from './auth-guard.service';

export const routes: Routes = [
    {path : '' , component: ListProductsComponent},
    {path : 'produits' , component: ListProductsComponent},
    {path : 'panier' , component: PanierComponent},
    {path : 'produits/:id' , component: DetailsProduitComponent},
    {path : 'auth' , component: AuthComponent},
    {path : 'sign-up' , component: SignUpComponent},
    {path : 'orders' , component: OrdersComponent , canActivate: [AuthGuardService]}
];

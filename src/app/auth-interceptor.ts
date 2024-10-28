import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private router : Router ,private authService : AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isAuthenticated = this.authService.isLoggedIn$;

        if(isAuthenticated){
            const authReq = req.clone({
                headers : req.headers.set('Authorization','Bearer' + this.authService.getToken)
            });
            return next.handle(authReq)
        }

        return next.handle(req);
    }
   
    
}

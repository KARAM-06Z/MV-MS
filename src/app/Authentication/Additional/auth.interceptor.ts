import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, map , take } from "rxjs";
import * as fromApp from '../../store/app.reducer';


@Injectable()
export class authInterceptorService implements HttpInterceptor{
    constructor(private store:Store<fromApp.appState>){}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.store.select('authentication').pipe(take(1),
        map(authState => {
            if(authState)
            return authState.user;

            return null
        }),
        exhaustMap( user => {
            const modifiedReq = req.clone({params : new HttpParams().set('auth' , user?.token ? user.token : "")});
            return next.handle(modifiedReq);
        }));
    }

}
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    /**
     * Elle prend en entrée une requête, et retourne la requête modifiée en sortie.
     * @param request
     * @param next
     * @returns
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isPublicRequest(request.url)) {
            request = this.addToken(request, localStorage.getItem('token')!);
        }
        // On utilise notre nouvelle méthode 'addContentType'.
        request = this.addContentType(request);

        // La méthode handle permet donc de passer la requête modifiée à l'intercepteur suivant
        return next.handle(request);
    }

    /**
     * Permet de cloner la requête passée en paramètre, et lui ajouter l'en-tête souhaitée, avant de retourner cette requête transformée.
     * @param request
     * @returns
     */
    private addContentType(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Permet d'ajouter un jeton d'autorisation à une requête, et de la retourner.
     * @param request
     * @param token
     * @returns
     */
    private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    private isPublicRequest(url: string): boolean {
        return (url.includes('verifyPassword') || url.includes('signupNewUser'));
    }
}
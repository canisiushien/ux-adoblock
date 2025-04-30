import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public app: AppMainComponent) { }

    ngOnInit() {
        this.model = [
            { label: 'Accueil', icon: 'pi  pi-fw pi-home', routerLink: ['/']},
            {
                label: 'Obtenir clés privé/publique', icon: 'pi pi-fw pi-key', routerLink: ['/admin/generate-keys']
            },
            {
                label: 'Enregistrer document', icon: 'pi pi-fw pi-pencil', routerLink: ['/admin/store-doc']
            },
            {
                label: 'Authentifier document', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/retrieve-doc']
            },
           
            // {//a supprimer
            //     label: 'UI Kit', icon: 'pi pi-fw pi-star-fill', routerLink: ['/uikit'],
            //     items: [
            //         {label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout']},
            //         {label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input']},
            //         {label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel']},
            //         {label: 'Invalid State', icon: 'pi pi-exclamation-circle', routerLink: ['/uikit/invalidstate']},
            //         {label: 'Button', icon: 'pi pi-fw pi-mobile', routerLink: ['/uikit/button'], class: 'rotated-icon'},
            //         {label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table']},
            //         {label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list']},
            //         {label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree']},
            //         {label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel']},
            //         {label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay']},
            //         {label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media']},
            //         {label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], preventExact: true},
            //         {label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message']},
            //         {label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file']},
            //         {label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts']},
            //         {label: 'Misc', icon: 'pi pi-fw pi-circle-off', routerLink: ['/uikit/misc']}
            //     ]
            // },
            // {//a supprimer
            //     label:'Prime Blocks', icon:'pi pi-fw pi-prime', routerLink: ['/blocks'],
            //     items:[
            //         {label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks']},
            //         {label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank'},
            //     ]
            // },
            // {//a supprimer
            //     label: 'Pages', icon: 'pi pi-fw pi-copy', routerLink: ['/pages'],
            //     items: [
            //         { label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] },
            //         { label: 'Calendar', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/calendar'] },
            //         { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/timeline'] },
            //         { label: 'Landing', icon: 'pi pi-fw pi-globe', url: 'assets/pages/landing.html', target: '_blank' },
            //         { label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/login'], target: '_blank' },
            //         { label: 'Error', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/error'], target: '_blank' },
            //         { label: '404', icon: 'pi pi-fw pi-times', routerLink: ['/404'], target: '_blank' },
            //         { label: 'Access Denied', icon: 'pi pi-fw pi-ban', routerLink: ['/accessdenied'], target: '_blank' },
            //         { label: 'Empty', icon: 'pi pi-fw pi-clone', routerLink: ['/pages/empty'] }
            //     ]
            // },
            {
                label: 'Utilisateur', icon: 'pi pi-fw pi-user', routerLink: ['/utilities'],
                items: [
                    {label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['utilities/icons']},
                    {label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank'},
                ]
            },
            // {
            //     label: 'Guide utilisation', icon: 'pi pi-fw pi-file', routerLink: ['/documentation']
            // }
        ];
    }

    onMenuClick(event) {
        if (!this.app.isHorizontal()) {
        }
        this.app.onMenuClick(event);
    }
}

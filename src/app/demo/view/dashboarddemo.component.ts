import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ProductService } from '../service/productservice';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/demo/badges.scss']
})
export class DashboardDemoComponent implements OnInit {

    products: any[];

    selectedCar: any;

    items: MenuItem[];

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);

        this.items = [
            { label: 'Settings', icon: 'pi pi-cog' },
            { label: 'Sign Out', icon: 'pi pi-sign-out' },
        ];
    }
}

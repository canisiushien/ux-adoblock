import { Component } from '@angular/core';

@Component({
  selector: 'app-front-public',
  templateUrl: './front-public.component.html',
  styleUrls: ['./front-public.component.scss']
})
export class FrontPublicComponent {
  features = [
    { img: 'assets/layout/images/landing/icon-responsive.png', title: 'RESPONSIVE LAYOUT', description: 'Lorem ipsum dolor sit amet...' },
    { img: 'assets/layout/images/landing/icon-modern.png', title: 'MODERN DESIGN', description: 'Lorem ipsum dolor sit amet...' },
    { img: 'assets/layout/images/landing/icon-welldocumented.png', title: 'WELL DOCUMENTED', description: 'Lorem ipsum dolor sit amet...' },
    { img: 'assets/layout/images/landing/icon-cleancode.png', title: 'CLEAN CODE', description: 'Lorem ipsum dolor sit amet...' },
    { img: 'assets/layout/images/landing/icon-beautiful.png', title: 'BEAUTIFUL', description: 'Lorem ipsum dolor sit amet...' },
    { img: 'assets/layout/images/landing/icon-justforyou.png', title: 'JUST FOR YOU', description: 'Lorem ipsum dolor sit amet...' }
  ];

  pricingPlans = [
    { name: 'BEGINNER', price: '5$ per month', features: ['Responsive', 'Push Messages'] },
    { name: 'PROFESSIONAL', price: '10$ per month', features: ['Responsive', 'Push Messages', 'Support Tickets', 'Free Shipping'] },
    { name: 'ENTERPRISE', price: '15$ per month', features: ['Responsive', 'Push Messages', 'Support Tickets', 'Free Shipping', 'Unlimited Space'] }
  ];

  footerLinks = [
    { title: 'UTILES', links: ['UJKZ', 'License']},
    { title: 'FAQ', links: ['Pourquoi Ethereum ?', 'Pourquoi Communiqué Off. ?'] },
    { title: 'SUPPORT', links: ['A propos', 'Guide utilisation'] }
  ];

}

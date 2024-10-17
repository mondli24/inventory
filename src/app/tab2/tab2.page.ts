import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page  {


  stats = [
    { title: 'Total Items', value: '1,500', icon: 'cube', label: 'inventory-overview' },
    { title: 'Low Stock', value: '25', icon: 'alert', label: 'low-stock' },
    // Add more stats as needed
  ];

  alerts = [
    { message: 'Bleach running low' },
    { message: 'New delivery received' },
    // Add more alerts as needed
  ];

  quickActions = [
    { title: 'Add Item', icon: 'add-circle', type: 'add' },
    { title: 'Scan Item', icon: 'scan-circle', type: 'scan' },
    // Add more actions as needed
  ];


  constructor() {}
  ngOnInit() {
  }

  goToDetail(page: string) {
    // Navigate to the detailed page
  }

  performAction(action: string) {
    // Handle action
  }

}

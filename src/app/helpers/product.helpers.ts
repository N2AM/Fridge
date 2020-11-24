import { Product } from '../models/product.model';
import {Injectable} from '@angular/core';
import { DialogService } from '../services/dialog.service';
@Injectable({
  providedIn: 'root'
})
export class ProductHelper {

    constructor(
        private dialogService: DialogService
    ) {}
    
    checkProductInStock(product: Product, quantity: Number): boolean {
        if(quantity > product['stock_qty']) {
          this.dialogService.openDialog({
            msg: 'Order quantity for product (product name) should be less than or equal (product quantity).',
              loginButtons: false,
              justOk: true
          })
          // Product isn't in stock.
            // reset click counter, so if user click again show this modal again.
            product['addClickCounter'] = 0;
          return false;
        } else {
          // if product is available in stock.
          return true;
        }
    }


    checkAddClickCounter(product: Product){
      /* click counter, to prevent calling API every time when 
      user make a huge number of clicks in same time.
      */
      !product.addClickCounter ? product.addClickCounter = 1 : product.addClickCounter++;

      // in click number one -> return true.
      if(product.addClickCounter == 1) return true;

      // else return false.
      else return false;
    }
  

    checkRemoveClickCounter(product: Product){
      /* click counter, to prevent calling API every time when 
      user make a huge number of clicks in same time.
      */
      !product.removeClickCounter ? product.removeClickCounter = 1 : product.removeClickCounter++;

      // in click number one -> return true.
      if(product.removeClickCounter == 1) return true;

      // else return false.
      else return false;
    }
}

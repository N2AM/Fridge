import { LoginDialogComponent } from './../shared/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { AddAddressFormDialog } from '../shared/add-address-form-dialog/add-address-form-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(
        private dialog: MatDialog,
        private overlay: Overlay
    ) {}
    
    preventBodyScroll() {
        document.getElementsByTagName('body')[0].classList.add('--height--100vh');
        document.getElementsByTagName('body')[0].classList.add('--overflow-y-hidden');
        document.getElementById('--navbar').classList.add('--mr-17px');
        document.getElementsByTagName('html')[0].classList.add('--mr-17px');
    }
    resetBodyScroll() {
        document.getElementsByTagName('body')[0].classList.remove('--height--100vh');
        document.getElementsByTagName('body')[0].classList.remove('--overflow-y-hidden');
        document.getElementById('--navbar').classList.remove('--mr-17px');
        document.getElementsByTagName('html')[0].classList.remove('--mr-17px');
    }

    openDialog(data) {
        this.preventBodyScroll();
        let dialog = this.dialog.open(LoginDialogComponent, {
            data: data,
            // width: '50%',
            // height: '10px',
            closeOnNavigation: true,
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            // backdropClass: '--no-shadow-bg'
        });
        dialog.afterClosed().subscribe((res)=>{
            this.resetBodyScroll();
         });
        return dialog;
    }

    openAddAddressDialog(data) {
        this.preventBodyScroll();

        let dialog = this.dialog.open(AddAddressFormDialog, {
            data,
            closeOnNavigation: true,
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            // scrollStrategy: this.overlay.scrollStrategies.block(),
            
        });

        dialog.afterClosed().subscribe((res)=>{
            this.resetBodyScroll();
        })

        return dialog;
    }

}
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

export class Friend {
  public id?: number;
  public firstName?: string;
  public lastName?: string;
  public department?: string;
  public email?: string;
  public country?: string;


}

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  friends?: Friend[];
  closeResult?: string;
  editForm!: FormGroup;
  deleteId?: number;

  constructor(
    private httpClient?: HttpClient, 
    private modalService?: NgbModal,
    private fb?: FormBuilder,
   
    ) { }

  ngOnInit(): void {
    this.getFriends();
    this.editForm = this.fb!.group({
      id: [''],
      firstName: [''],
      lastName: [''],
      department: [''],
      email: [''],
      country: ['']
    } );
  }

  getFriends(){
    this.httpClient?.get<any>('http://localhost:8080/friends').subscribe(
      response => {
        console.log(response);
        this.friends = response;
      }
    );
  }

  open(content: any) {
    this.modalService?.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:8080/friends/add';
    this.httpClient?.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService?.dismissAll(); //dismiss the modal
  }

  openDetails(targetModal: any, friend: Friend) {
    this.modalService?.open(targetModal, {
     centered: true,
     backdrop: 'static', 
     size: 'lg'
   });
    document.getElementById('fname')?.setAttribute('value', friend.firstName as string);
    document.getElementById('lname')?.setAttribute('value', friend.lastName as string);
    document.getElementById('dept')?.setAttribute('value', friend.department as string);
    document.getElementById('email2')?.setAttribute('value', friend.email as string);
    document.getElementById('cntry')?.setAttribute('value', friend.country as string);
 }

 openEdit(targetModal: any, friend: Friend) {
  this.modalService?.open(targetModal, {
    backdrop: 'static',
    size: 'lg'
  });
  this.editForm?.patchValue( {
    id: friend.id, 
    firstName: friend.firstName,
    lastName: friend.lastName,
    department: friend.department,
    email: friend.email,
    country: friend.country
  });
}

onSave() {
  const editURL = 'http://localhost:8080/friends/' + this.editForm?.value.id + '/update';
  console.log(this.editForm?.value);
  this.httpClient?.put(editURL, this.editForm?.value)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService?.dismissAll();
    });
}

openDelete(targetModal: any, friend: Friend) {
  this.deleteId = friend.id;
  this.modalService?.open(targetModal, {
    backdrop: 'static',
    size: 'lg'
  });
}

onDelete() {
  const deleteURL = 'http://localhost:8080/friends/' + this.deleteId + '/delete';
  this.httpClient?.delete(deleteURL)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService?.dismissAll();
    });
}
}

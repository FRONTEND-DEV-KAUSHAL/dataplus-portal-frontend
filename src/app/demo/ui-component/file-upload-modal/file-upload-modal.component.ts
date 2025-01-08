import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadComponent } from '../file-upload/file-upload.component'

@Component({
  selector: 'app-file-upload-modal',
  standalone: true,
  imports: [FileUploadComponent],
  templateUrl: './file-upload-modal.component.html',
  styleUrl: './file-upload-modal.component.scss'
})
export class FileUploadModalComponent {
  uploadedFiles: File[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  handleFilesUploaded(files: File[]) {
    this.uploadedFiles = files;
    // this.activeModal.close(this.uploadedFiles);
  }

  confirm() {
    this.activeModal.close(this.uploadedFiles);
  }
}

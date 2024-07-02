import { Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
import { FullMetadata, Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { Observable } from 'rxjs';
import { placeholder } from './upload-image.placeholder';

export interface SavedPictureEventType
{
  metadata: FullMetadata,
  index: number
};

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss'
})
export class UploadImageComponent {
  constructor(private imageCompress: NgxImageCompressService) { }

  @Input() numberOfPictures: number = 1;
  @Input() buildingId: string | undefined;
  @Output() pictureSaved = new EventEmitter<SavedPictureEventType>();

  private readonly storage: Storage = inject(Storage);

  imgResultBeforeCompression: string = '';
  imgResultAfterCompression: string = '';

  maxHeight = 1000
  maxWidth = 1000

  imgResultThumb: string[] = [];
  imgResultCompress: string[] = [];


  ngOnInit(){
    Array.from({ length: this.numberOfPictures }, (_, index) => 
    {
      this.imgResultThumb[index] =   placeholder;
      this.imgResultCompress[index] = "";
    });
  };

  compressFileToFixed(index: number) {
    const MAX_MEGABYTE = 1;
    this.imageCompress
      .uploadAndGetImageWithMaxSize(MAX_MEGABYTE, true) // this function can provide debug information using (MAX_MEGABYTE,true) parameters
      .then(
        (result: string) => {
        this.TempImgResultAfterCompAndThumb(result, index);
        },
        (result: string) => {
          // img uncompressable
          // test if result size is larger than MaxMegabyte
          let MaxByteSize = MAX_MEGABYTE * 1048576;

           let size = this.imageCompress.byteCount(result);

           if(size > MaxByteSize)
            {
              console.error(
                "The compression algorithm didn't succed! The best size we can do is",
                this.imageCompress.byteCount(result),
                'bytes'
              )
            }
            this.TempImgResultAfterCompAndThumb(result, index);
        }
      );
  }


  TempImgResultAfterCompAndThumb(result: string, index: number)
  {
    this.imgResultCompress[index] = result;
     this.SavePictures(index).then(
      result => this.pictureSaved.emit({index, metadata: result.metadata}), err => alert(err))
     .then(val =>{
      this.imageCompress.compressFile(result,DOC_ORIENTATION.Default, 100, 100, 500, 300) // 50% ratio, 50% quality
        .then(compressedImage => {
          this.imgResultThumb[index] = compressedImage;
          console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
        }, (err)=> alert(err));
     }, (err)=> console.log("eeeeeeee"));
  }

   async SavePictures(index: number) {
      let file = this.base64ToFile(this.imgResultCompress[index], this.buildingId! + "-" + index + ".jpeg")
  
      if (file) {
        console.log("FILE")
        const storageRef = ref(this.storage, file.name);
        console.log(storageRef);
       var task =  uploadBytesResumable(storageRef, file)
       task.catch(err => alert(err));
       return task;
    }
    throw new Error("imgResultCompress error")
  }

  private base64ToFile(dataURI: string, filename: string): File {
    // Extraire le contenu base64 de la chaîne Data URI

    let base64String = dataURI.split(',')[1];
    let binary = atob(base64String);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }

    let byteArray = new Uint8Array(array);

    // Créer un Blob à partir du tableau d'octets
    let blob = new Blob([byteArray], { type: 'image/jpeg' }); // Assurez-vous de remplacer 'image/jpeg' par le type MIME approprié

    // Convertir Blob en File
    let file = new File([blob], filename, { type: 'image/jpeg' }); // Assurez-vous de définir le type MIME correctement

    return file;
  }
}

import { Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
import { FullMetadata, Storage, deleteObject, getDownloadURL, listAll, ref, uploadBytesResumable } from '@angular/fire/storage';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { Observable } from 'rxjs';
import { placeholder, spiner } from './upload-image.placeholder';

export interface SavedPictureEventType {
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
  imgFilePath: string[] = [];

  public placeHolder = placeholder;


  ngOnInit() {
    // Initialize arrays with placeholders
    Array.from({ length: this.numberOfPictures }, (_, index) => {
      this.imgResultThumb[index] = placeholder;
      this.imgResultCompress[index] = "";
    });

    // Load existing images if any
    if (this.buildingId) {
      this.loadExistingImages(this.buildingId);
    }
  }

  async loadExistingImages(buildingId: string) {
    const folderPath = `${buildingId}/`; // Define the folder path
    const storageRef = ref(this.storage, folderPath);

    try {
      // List all items in the directory to get image references
      const result = await listAll(storageRef);

      // Fetch each file's URL and set to imgResultThumb array
      const fetchImagePromises = result.items.map(async (itemRef, index) => {
        try {
          const url = await getDownloadURL(itemRef);
          // Convert the URL to a base64 string for compression
          //   const base64Image = await this.urlToBase64(url);
          this.imgResultThumb[index] = url;
          this.imgResultCompress[index] = url;
          this.imgFilePath[index] = url;
          // Call thumb to generate thumbnail
          //   this.thumb(base64Image, index);
        } catch (error) {
          console.error(`Failed to get download URL for image ${index}:`, error);
        }
      });

      // Wait for all URLs to be fetched and processed
      await Promise.all(fetchImagePromises);

    } catch (error) {
      console.error("Error loading existing images:", error);
    }
  }

  async urlToBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  compressFileToFixed(index: number) {
    const MAX_MEGABYTE = 1;
   
    this.imageCompress
      .uploadAndGetImageWithMaxSize(MAX_MEGABYTE, true) // this function can provide debug information using (MAX_MEGABYTE,true) parameters
      .then(
        (result: string) => {
          this.imgResultThumb[index] = spiner;
          this.TempImgResultAfterCompAndThumb(result, index);
        },
        (result: string) => {
          // img uncompressable
          // test if result size is larger than MaxMegabyte
          let MaxByteSize = MAX_MEGABYTE * 1048576;

          let size = this.imageCompress.byteCount(result);

          if (size > MaxByteSize) {
            console.error(
              "The compression algorithm didn't succed! The best size we can do is",
              this.imageCompress.byteCount(result),
              'bytes'
            )
          }
          this.TempImgResultAfterCompAndThumb(result, index);
        }
      ).catch(() => {
        this.imgResultThumb[index] = placeholder;
      }).catch(() => 
        this.imgResultThumb[index] = placeholder)
  }


  TempImgResultAfterCompAndThumb(result: string, index: number) {
    this.imgResultCompress[index] = result;
    this.SavePictures(index).then(
      result => this.pictureSaved.emit({ index, metadata: result.metadata }), err => alert(err))
      .then(val => {
        this.thumb(result, index);
      }, (err) => console.log("eeeeeeee"));
  }


  thumb(result: string, index: number) {
    this.imageCompress.compressFile(result, DOC_ORIENTATION.Default, 100, 100, 500, 300) // 50% ratio, 50% quality
      .then(compressedImage => {
        this.imgResultThumb[index] = compressedImage;
        console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
      }, (err) => alert(err));
  }

  async SavePictures(index: number) {
    // Convert the base64 image to a File object
    let file = this.base64ToFile(this.imgResultCompress[index], this.buildingId! + "-" + index + ".jpeg");

    if (file) {
      console.log("FILE");

      // Create a folder with the buildingId and store the file inside it
      const folderPath = `${this.buildingId}/`;  // This is the folder path
      this.imgFilePath[index] = folderPath + file.name;   // This is the full path including the folder and file name

      // Create a reference to the file in Firebase Storage within the specified folder
      const storageRef = ref(this.storage, this.imgFilePath[index]);
      console.log(storageRef);

      // Start the upload task
      const task = uploadBytesResumable(storageRef, file);

      // Handle any errors during the upload process
      task.catch(err => alert(err));

      // Return the task to allow further actions if needed
      return task;
    }
    throw new Error("imgResultCompress error");
  }

  remove(i: number) {
    this.imgResultThumb[i] = spiner;
    this.deleteImage(this.imgFilePath[i]).then(() => {
      this.imgResultThumb[i] = placeholder;
    })
  }

  // Méthode pour supprimer une image
  private async deleteImage(imagePath: string) {
    const storageRef = ref(this.storage, imagePath);
    try {
      await deleteObject(storageRef);
      console.log('Image successfully deleted:', imagePath);
    } catch (error) {
      console.error('Error removing image:', error);
    }
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

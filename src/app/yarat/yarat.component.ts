import { Component, OnInit } from '@angular/core';;
import { AngularFirestore } from 'angularfire2/firestore'
import { Router } from '@angular/router';

@Component({
  selector: 'app-yarat',
  templateUrl: './yarat.component.html',
  styleUrls: ['./yarat.component.css']
})
export class YaratComponent implements OnInit {
  optCount = 2; // bu counter'ı forma yeni seçenek eklenirse bu seçeneği firestore'a gönderirken keyini eklemek için kullanıyorum, rastgele bir id de verebilirdim.
  options: string[] = [];
  isIDExists = false;
  genID:string;
  submitClicked= false;
  surveys;
  //dataSubscribed=false;
  duplicateError = false;
  subscription;

  constructor(private db: AngularFirestore, private router:Router) { }

  ngOnInit() {
    //veriler elde edildikten sonra check işlemi yapılacak bu yüzden subscription'ın içinde işlemler yapılıyor.
    this.subscription = this.db.collection("Surveys").valueChanges().subscribe( result => {
      this.surveys = result;
    });
    
  }

  addOption(){
    this.options.push('Seçenek')
    this.optCount++;
  }

  onSubmit(f){
    //Seçenekler aynı mı diye test edeceğiz aynı ise hata vereceğiz, değilse işleme devam:
    var newObj = {...f.value}
    delete newObj.Question;
    delete newObj.ID;
    var vals = Object.values(newObj)

    if(new Set(vals).size !== vals.length){
      this.duplicateError = true;
      this.isIDExists = false; //isIDExists verdikten sonra duplicateError verirse, devam edemediği için ID hatası da görünür kalıyor onu geçirmek için.
    }else {
      this.duplicateError = false;
      this.checkID(f);}
      
  }


  checkID(form){ //ID'yi check edecek ve sonuca göre hata verecek veya upload işlemini yapacak.
    
      if(!this.submitClicked){   
        //surveys içerisinde girilen form ID'si var mı diye bakılıyor varsa error'un içi doldurulacak.
        let error = this.surveys.find(obj => obj.ID === form.value.ID);
        if(error!=undefined){ //&& !this.submitClicked kısmını çıkardım.
          this.isIDExists = true;
         
        }else { //!this.submitClicked koşulunu çıkardım.
          this.isIDExists = false; 
          form.value.date = new Date();
          this.db.collection("Surveys").add(form.value);
          this.submitClicked = true;
          //Artık upload işlemi yapıldı, kullanıcıya ID gösterilecek ekranda subscription'ın devam etmesine gerek yok.
          this.subscription.unsubscribe();
        }      
     } 

  }

  genRandomID(){
    this.genID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }


  unsubscribe = this.db.collection("Surveys").snapshotChanges

  copyClipboard(){
    var copyText = document.getElementById('idContent') as HTMLInputElement;
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-katil',
  templateUrl: './katil.component.html',
  styleUrls: ['./katil.component.css']
})
export class KatilComponent implements OnInit, OnDestroy {

  surveys;
  isClicked = false;
  selectedSurvey;
  selectedSurveyID;
  docID;
  selectedOption="";
  selectedSurveyOptions;
  srvy;
  lastEnteredInvalidID;
  answers;
  participation;
  options;
  analysisList;
  formID;
  duplicateError=false;
  subscriptionSurveys;
  subscriptionAnswers;


  constructor(private db: AngularFirestore, private router:Router) { }

  ngOnInit() {
    //Surveys'e subscribe olalım, sonucu this.surveys'e atalım:
      this.subscriptionSurveys=this.db.collection('Surveys')
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          };
        });
      }))
      .subscribe(result => {
        //surveys'in içi surveys koleysiyonu ile dolduruluyor.
        this.surveys = result;
      });  


      
  }

  onSubmit(form) {
    this.checkID(form); 
    this.isClicked = true;
    this.deleteOldSurveys()   
  }

  onSubmit2(form){ //Cevap gönderildiğinde çalışacak.

    let docID = this.selectedSurvey.id;

    //Eğer kullanıcı yeni seçenek girdiyse, selectedSurvey'in docID'si kullanılarak ilgili document'a yeni bir seçenek alanı eklenir.
    if(form.value.group=="other"){

      //Girilen yeni değer, eski seçeneklerle aynı mı diye kontrol edelim aynıysa ilerlemeden hata verelim:
      var vals = this.selectedSurveyOptions.slice()
      vals.push(form.value.opt)
      if(new Set(vals).size !== vals.length){
        this.duplicateError = true;
      }else {
        this.duplicateError = false;
        //Duplicate error söz konusu değilse, artık ekleme işlemini yapabiliriz:

        //docID'ye göre Surveys koleksiyonunun ilgili dökümanına yeni seçenek alanı eklenir.
        let newObj = {[this.genRandomID()]:form.value.opt};
        this.db.doc("Surveys/"+docID).update(newObj);

        //Şimdi de verilen cevap, katılımcı ismi ile birlikte ilgili survey doc'un içinde bir Answers subcollection'ınına kaydedilsin.
        // SurveyDocID:this.selectedSurvey.id, SurveyID:this.selectedSurvey.ID, soldaki iki seçenek ekliydi bence gerek yok çıkardım.
        let sendObj = {Name:form.value.name, option:form.value.opt}
        this.db.collection("Surveys").doc(docID).collection("Answers").add(sendObj);
        this.router.navigate(['/look']);
      }

    }else { //Eğer varolan seçeneklerden biri seçildiyse direkt olarak selectedSurvey'in altına cevap eklensin:
      let sendObj = {Name:form.value.name, option:form.value.group}
      this.db.collection("Surveys").doc(docID).collection("Answers").add(sendObj);
      this.router.navigate(['/look']);
    }

  }


  checkID(form){ // İlgili id'ye karşılık bir survey varsa selectedSurvey'e atasın, options'ı selectedSurveyOptions'a atılsın, ilgili Answers'e subscribe olunsun.

    //Öncelikle şuanda this.surveys'in içinin doldurup doldurulmadığını test edelim, boşken surveys.find çalışmayacaktır:
    if(this.surveys!=undefined){
        //form'a girilen ID'ye denk düşen survey selectedSurvey objesi olarak seçiliyor.
        this.formID = form.value.ID
        this.selectedSurvey = this.surveys.find(obj => obj.ID === this.formID ); 
        //Eğer girilen ID'ye karşılık bir survey database'de varsa, selectedSurvey'in seçeneklerini selectedSurveyOptions içine atıyoruz.
        if(this.selectedSurvey != undefined){
          this.selectedSurvey = this.surveys.find(obj => obj.ID === this.selectedSurvey.ID );
          this.deleteSurveyProperties()
          this.selectedSurveyOptions = Object.values(this.srvy);//selectedSurveyOptions girilen ID'li survey'in seçeneklerini içeren bir array.
          //Artık selectedSurvey'imiz belli olduğuna göre, bu survey'in altındaki Answers koleksiyonunu dinlemeye başlayabiliriz.
          this.answersSubscribe(this.selectedSurvey.id);
          //Aynı zamanda artık katılınacak survey belli olduğuna göre, survey koleksiyonunu dinlemeyi burada kesebiliriz.
          //Ancak bu durumda, eğer katılımca, ankete katılmadan fikir değiştirip yeni yaratılan bir anket girerse, ulaşamayacaktır. Olsun şimdilik bunu kabul ediyorum.
          this.subscriptionSurveys.unsubscribe();
        }else{
          //id bulunamadı demektir, şuan bir şey yapmamıza gerek yok gibi duruyor, zaten selectedSurvey undefined olacak demektir.
        }
    }         
  }

  deleteSurveyProperties(){ //selectedSurvey'in optionları dışındaki key'lerini sileriz.
    this.srvy = {...this.selectedSurvey};
    delete this.srvy.ID;
    delete this.srvy.id;
    delete this.srvy.Question;
    delete this.srvy.date;
  }

  genRandomID(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  answersSubscribe(docID){
    //Burada selectedSurvey'in Answers'ına subscribe olunuyor, doluysa analiz yapılıyor boşsa sadece subscribe ile yetiniliyor.
    this.subscriptionAnswers = this.db.collection('Surveys').doc(docID).collection("Answers")
    .valueChanges()
    .subscribe(result => {
      this.answers = result;
      this.analyse(this.answers);  //Answers daha oluşmamışsa result boş array [] oluyor, sonuçta analizde sıkıntı çıkmıyor.
    });    
  }

  
  analyse(Answers){ //Analiz sonucunda ilgili Answers içinde toplam kaç cevap var, hangi cevabı kimler vermiş, yüzde kaç verilmiş gibi bilgiler analysisList içine atılıyor!
    //ankete toplamda kaç kişi katılmış?
    this.participation = this.answers.length;

    var analyseList= [];

    //her option'ı ayrı ayrı gezerek bu cevabı verenlerin bilgilerini çekelim.
    this.selectedSurveyOptions.forEach(element => {
      var specificAnswers = this.answers.filter(obj => {return obj.option === element})
      var count = specificAnswers.length;

      if(count>0){     
        analyseList.push({option:element, count:count, percent:((count/this.participation)*100).toPrecision(3), names:specificAnswers.map(a => a.Name)})

      } else  {
        analyseList.push({option:element, count:0, percent:0, names:[]})
      }      
    });
   
    this.analysisList = analyseList;
    
  }

  getPercent(currentOption){
    if(this.analysisList!=undefined){
      return this.analysisList.find(obj => obj.option === currentOption).percent;
    }
  }

  ngOnDestroy(){
    if(this.subscriptionAnswers!=undefined){
      this.subscriptionAnswers.unsubscribe();
    }
  }

  deleteOldSurveys(){
        //Şimdi burada şans faktörüne bağlı olarak, 3 günü geçmiş survey'leri listeden silelim, böylece database'in çok büyümesine engel olalım:
        //0-100 arasında random atılacak, rakam 7 ise silme işlemi yapılacak, bu random da yalnızca ankete katıldan Katıl butonuna basıldığında atılacak.
        let randomNum = Math.round(Math.random() * 100);
        if(randomNum == 7){

          let oldSurveys = this.surveys.filter(obj => {
            let diff = new Date().getTime()/1000 - obj.date.seconds //sn cinsinden fark bulundu.
            return ((diff/(3600 * 24)) > 3)   //Yaratılma tarihi ile şimdi arasında 72 saatten (3 günden) fazla zaman geçtiyse  oldSurveys içine kaydolsun.
          });
          //filter ya boş array ya da dolu bir array olarak dönecek boş dönerse de forEach'e girmez yani sıkıntı yok.
          oldSurveys.forEach(element => {
            this.db.collection("Surveys").doc(element.id).delete()
          });
       }
  }

}

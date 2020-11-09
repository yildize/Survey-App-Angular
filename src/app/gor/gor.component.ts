import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';


@Component({
  selector: 'app-gor',
  templateUrl: './gor.component.html',
  styleUrls: ['./gor.component.css']
})
export class GorComponent implements OnInit {

  constructor(private db: AngularFirestore, private router:Router) { }


  dataSource;
  surveys;
  srvy;
  surveyResults;
  selectedSurvey;
  answers;
  options;
  analysisResults;
  participation;
  analysisList;
  displayedColumns=['option','count','percent','names'];
  @ViewChild(MatSort) sort: MatSort;
  formID
  notFound = false;
  subscriptionSurveys
  subscriptionAnswers

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
    this.checkID(form); //Surveys'e subscribe olunur.
  }


  analyse(Answers){
    //ankete toplamda kaç kişi katılmış?
    this.participation = this.answers.length;

    var analyseList= [];

    //her option'ı ayrı ayrı gezerek bu cevabı verenlerin bilgilerini çekelim.
    this.options.forEach(element => {
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
  

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  answersSubscribe(docID){

        this.db.collection('Surveys').doc(docID).collection("Answers")
        .valueChanges()
        .subscribe(result => {
          this.answers = result;
          this.analyse(this.answers);
      
          //Tablonun sort işlemini yapabilmesi için atamalar yapıyoruz:
          var dataSource = new MatTableDataSource(this.analysisList);
          dataSource.data = this.analysisList;
          setTimeout( () => {
            dataSource.sort = this.sort;
          }, 0);            
          this.dataSource = dataSource;          
          });
  }


  checkID(form){

      //form'a girilen ID'ye denk düşen survey selectedSurvey objesi olarak seçiliyor.
      this.formID = form.value.ID
      this.selectedSurvey = this.surveys.find(obj => obj.ID === this.formID );

      //Eğer girilen ID'ye karşılık bir survey database'de varsa, selectedSurvey'in seçeneklerini options içine atıyoruz.
      if(this.selectedSurvey!=undefined){ //girilen survey bulundu.
        this.deleteSurveyProperties();                                 
        this.options = Object.values(this.srvy); //selectedSurveyin seçenekleri elde edildi. 
        //Artık hangi surveyin cevaplarına bakacağımızı biliyoruz, selectedSurvey'in cevaplarına subscribe olalım.
        this.subscriptionAnswers = this.answersSubscribe(this.selectedSurvey.id)
        //Surveys'i ise burada unsubscribe etmek istemiyorum, kullanıcı bir başka ankete de bakabilsin istiyorum, o yüzden onDestroy içerisinde unsubscribe edeceğim.
        this.notFound = false;
      }else {
        this.notFound=true;
      }      
    
      
  }
  


  deleteSurveyProperties(){ //selectedSurvey'in optionları dışındaki key'lerini sileriz.
  this.srvy = {...this.selectedSurvey};
  delete this.srvy.ID;
  delete this.srvy.id;
  delete this.srvy.Question;
  delete this.srvy.date;
  }

  ngOnDestroy(){
    this.subscriptionSurveys.unsubscribe()
    if(this.subscriptionAnswers!=undefined){
      this.subscriptionAnswers.unsubscribe()
    }
  }



}


  




import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InjuryPreventionService } from 'src/app/_services/injury-prevention.service';

@Component({
  selector: 'strategy-prevention-dialog',
  templateUrl: './strategy-prevention-dialog.component.html',
  styleUrls: ['./strategy-prevention-dialog.component.scss']
})
export class StrategyPreventionDialogComponent implements OnInit {

  constructor(
    private injuryPreventionService:InjuryPreventionService
  ) { }

  @Input() visible:boolean = false
  @Input() evaluatingProgram:any
  @Output() close = new EventEmitter<boolean>()
  @Output() evaluated = new EventEmitter<number>()

  evaluationQuestions:any = []
  evaluationAnswers:any = {
    answers: []
  }
  loading:boolean = false
  selectedQuestions:any=[]

  selectedAll:boolean

  closeDialog(){
    this.evaluationQuestions.map((question:any) => question.selected = false)
    this.selectedQuestions = this.evaluationAnswers.answers = []
    this.selectedAll = false
    this.close.emit(false)
  }

  selectAnswer(question:any){
    const answer = {
      evaluation_question_id: null,
      value: true
    }
    question.selected = !question.selected
    if(question.selected){
      answer.evaluation_question_id = question.id
      this.evaluationAnswers.answers.push(answer)
    }
    else{
      this.evaluationAnswers.answers = this.evaluationAnswers.answers.filter((item:any) => item.evaluation_question_id!=question.id)
    }
    console.log(this.selectedQuestions)
  }
  
  selectAllAnswers(questions:any){
    if(this.selectedAll){
      // console.log(this.selectedAll)
      this.evaluationAnswers.answers = []
      this.selectedQuestions = []

      questions.forEach((question:any) => {
        question.selected = this.selectedAll
        this.selectedQuestions.push(String(question.id))
        this.evaluationAnswers.answers.push({
          evaluation_question_id: question.id,
          value: true
        })          
      });
    }else{
      this.evaluationAnswers.answers = []
      this.selectedQuestions = []
      questions.forEach((question:any) => {
        question.selected = this.selectedAll       
      });
    }
    
    // console.log(this.evaluationAnswers)
    // console.log(this.selectedQuestions)
  }

  onSubmit(){
    if(this.evaluationAnswers.answers.length>0){
      this.loading = true
      this.injuryPreventionService.evaluatePreventiveProgram(this.evaluationAnswers,this.evaluatingProgram.team_id,this.evaluatingProgram.player_id,this.evaluatingProgram.injury_prevention_id).subscribe((res:any) => {
        this.closeDialog()
        this.loading = false
        this.evaluated.emit(res.data)
      })
    }
  }

  ngOnInit(): void {
    this.injuryPreventionService.getEvaluationQuestions().subscribe((data:any) => {
      this.evaluationQuestions = data.data
    })

  }

}

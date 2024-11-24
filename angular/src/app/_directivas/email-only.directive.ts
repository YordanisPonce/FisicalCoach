import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[emailOnly]'
})
export class EmailOnlyDirective {

  constructor(
    private el: ElementRef
  ) {
    // console.log('Directiva creada correctamente')
  }

  email:string = ''

  @HostListener('click') 
  oneCLick(): void{
    // console.log('%c' + 'Has hecho un click', 'color:blue')
  }

  @HostListener('input',['$event'])
  validateInput(event:any){
    // console.log(event.target.value)
    const value = event.target.value
    this.email = value
  }

  @HostListener('keydown', ['$event'])
  disableEnterKey(event:KeyboardEvent){
    if(event.key==='Enter' && this.email !== 'hola'){
      event.preventDefault()
    }
  }


}

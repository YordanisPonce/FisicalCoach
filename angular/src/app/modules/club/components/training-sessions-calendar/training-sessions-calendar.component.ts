import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking

interface Country {
    name: string,
    code: string
}

@Component({
  selector: 'app-training-sessions-calendar',
  templateUrl: './training-sessions-calendar.component.html',
  styleUrls: ['./training-sessions-calendar.component.scss']
})
export class TrainingSessionsCalendarComponent implements OnInit {

  constructor() {
    this.countries = [
      {name: 'Australia', code: 'AU'},
      {name: 'Brazil', code: 'BR'},
      {name: 'China', code: 'CN'},
      {name: 'Egypt', code: 'EG'},
      {name: 'France', code: 'FR'},
      {name: 'Germany', code: 'DE'},
      {name: 'India', code: 'IN'},
      {name: 'Japan', code: 'JP'},
      {name: 'Spain', code: 'ES'},
      {name: 'United States', code: 'US'}
    ];  
  }
  
  calendarOptions: CalendarOptions = {
  // locale: esLocale,
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },
    navLinks: false,
    events: [
      {
            // id: 1,
        title: "All Day Event",
        start: "2021-02-01"
      },
      {
            // id: 2,
        title: "Long Event",
        start: "2021-02-07",
        end: "2021-02-10"
      },
      {
        // id: 3,
        title: "Repeating Event",
        start: "2021-02-09T16:00:00"
      },
      {
        // id: 4,
        title: "Repeating Event",
        start: "2021-02-16T16:00:00"
      },
      {
            // id: 5,
        title: "Conference",
        start: "2021-02-11",
        end: "2021-02-13"
      },
      {
            // id: 6,
        title: "Meeting",
        start: "2021-02-12T10:30:00",
        end: "2021-02-12T12:30:00"
      },
      {
            // id: 12,
        title: "Click for Google",
        url: "http://google.com/",
        start: "2021-02-28"
      }
    ]
  };

  countries: Country[];
  
  selectedCountry!: Country;

  print(event:any){
    console.log (event)
    console.log (this.selectedCountry)
  }

  ngOnInit(): void {
  }

}

import { Pipe } from '@angular/core';

@Pipe({
    name: 'clasificationColors'
})
export class ClasificationColorsPipe {

    transform(color: string): any {
        if (color)
        {
            switch (color)
            {
                case '#F92F28':

                    return '#fac8c8'


                case '#FFA200':

                    return '#f8e1c0'


                case '#D9F10A':

                    return '#fbffce'


                case '#024CAC':

                    return '#a9e6ff'


                case '#00E9C5':

                    return '#9af9e9'


                default:
                    return 'rgba($color: #2fdb57, $alpha: 0.14)'
            }
        } else
        {
            return {
                red: '#fac8c8',
                orange: '#f8e1c0',
                yellow: '#fbffce',
                blue: '#a9e6ff',
                green: '#9af9e9'
            }
        }
    }

}


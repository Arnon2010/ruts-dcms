import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'thaiDate'})
export class ThaiDatePipe implements PipeTransform {
  transform(value: string): string {
    const parts = value.split('-');
    const thaiYear = parseInt(value.split('-')[0]) + 543;
    if(parts[2] != '00') {
        return `${parts[2]}/${parts[1]}/${thaiYear}`;
    } else {
        return '-';
    }
  }
}

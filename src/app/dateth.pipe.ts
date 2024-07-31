import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiDate'
})

export class ThaiDatePipe implements PipeTransform {

  // transform(value: string): string {
  //   const parts = value.split('-');
  //   const thaiYear = parseInt(value.split('-')[0]) + 543;
  //   if(parts[2] != '00') {
  //       return `${parts[2]}/${parts[1]}/${thaiYear}`;
  //   } else {
  //       return '-';
  //   }
  // }

  transform(value: string): string {
    if (!value) {
      return ''; // or some default value or format
    }
    const dateParts = value.split('-');
    // Assuming the date format is YYYY-MM-DD
    const thaiMonthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const year = parseInt(dateParts[0], 10) + 543;
    const month = thaiMonthNames[parseInt(dateParts[1], 10) - 1];
    const day = dateParts[2];
    return `${day} ${month} ${year}`;
  }
}

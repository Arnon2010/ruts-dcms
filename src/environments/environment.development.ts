//const url = 'http://localhost:30424/';  //docker mac
const url = 'http://localhost:8096/';  //docker win
//const url = 'http://localhost/dcms-api'; //localhost
//const url = 'https://dcms.rmutsv.ac.th/assets/'; //server
export const environment = {
    production: false,
    baseUrl: url + 'api',
    pdfUrl: url + 'pdf',
    baseUrlUpload: url + 'documents',
    //baseUrlUpload: 'assets/documents',
    //vieFile: 'assets/documents',
    vieFile: url + 'documents',
    baseUrlReport: url + 'report'
  };

  




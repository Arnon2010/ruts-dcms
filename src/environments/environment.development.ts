const url = 'http://localhost:8010/';  //docker
//const url = 'http://localhost/'; //localhost
export const environment = {
    production: false,
    baseUrl: url + 'dcms-api/api',
    pdfUrl: url + 'dcms-api/pdf',
    baseUrlUpload: url + 'dcms-api/documents',
    vieFile: 'assets/documents',
    //baseUrlUpload: 'assets/documents',
    baseUrlReport: url + 'dcms-api/report'
  };




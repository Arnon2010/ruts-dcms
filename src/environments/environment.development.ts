//const url = 'http://localhost:8010/';  //docker
const url = 'http://localhost/'; //localhost
export const environment = {
    production: false,
    baseUrl: url + 'dcms-api/api',
    pdfUrl: url + 'dcms-api/pdf',
    baseUrlUpload: url + 'dcms-api/documents',
    //baseUrlUpload: 'assets/documents',
    //vieFile: 'assets/documents',
    vieFile: url + 'dcms-api/documents',
    baseUrlReport: url + 'dcms-api/report'
  };




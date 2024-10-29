const PDFDocument = require('pdfkit')
const fs = require('fs')
function buildPDF(dataCallback,endCallback){

    const doc = new PDFDocument();
    doc.on('data',dataCallback)
    doc.on('end',endCallback)
    doc.text('Reporte de Usuarios', 200, 100)

    doc.end()
}

exports.buildPDF = buildPDF;
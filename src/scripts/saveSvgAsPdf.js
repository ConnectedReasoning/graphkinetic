//import './saveSvgAsPng';
//import './jspdf';

function svgToPdf(svg, callback) {
  saveSvgAsPng.svgAsDataUri(svg, {}, function(svgUri) {
    let image = document.createElement('img');

    image.src = svgUri;
    image.onload = function() {
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      let doc = new jsPDF('portrait', 'pt');
      let dataUrl = null;

      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, image.width, image.height);
      dataUrl = canvas.toDataURL('image/jpeg');
      doc.addImage(dataUrl, 'JPEG', 0, 0, image.width, image.height);

      callback(doc);
    };
  });
}


function downloadPdf(name, dataUriString) {
  let link = document.createElement('a');
  link.addEventListener('click', function(ev) {
    link.href = dataUriString;
    link.download = name;
    document.body.removeChild(link);
  }, false);
  document.body.appendChild(link);
  link.click();
}
module.exports = {
  svgToPdf: svgToPdf,
  downloadPdf: downloadPdf
};


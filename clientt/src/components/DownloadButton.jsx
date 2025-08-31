import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DownloadButton = ({ rootElementId, downloadFileName, videoLinks }) => {
  const downloadPdfDocument = () => {
    const input = document.getElementById(rootElementId);
    
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = pdfHeight;
      let position = 0;

      // Add the initial image
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      // Logic for multi-page PDFs if the content is very long
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      // --- ADD THIS NEW LOGIC FOR VIDEO LINKS ---
      if (videoLinks && Object.keys(videoLinks).length > 0) {
        pdf.addPage(); // Add a new page specifically for the video links
        let yPos = 20; // Start position for links
        
        pdf.setFontSize(16);
        pdf.text('Referenced Videos', 15, yPos);
        yPos += 10;
        
        pdf.setFontSize(12);
        Object.entries(videoLinks).forEach(([query, videoId]) => {
          const url = `https://www.youtube.com/watch?v=${videoId}`;
          pdf.setTextColor(40, 58, 117); // Set text color to a URL-like blue
          pdf.textWithLink(`- Click here for video on "${query}"`, 15, yPos, { url });
          yPos += 10;
        });
      }
      // --- END OF NEW LOGIC ---

      pdf.save(`${downloadFileName}.pdf`);
    });
  };

  return (
    <button
      onClick={downloadPdfDocument}
      className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
    >
      Download as PDF
    </button>
  );
};

export default DownloadButton;
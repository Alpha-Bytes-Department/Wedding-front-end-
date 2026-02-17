import React from "react";

const PrintStyles: React.FC = () => {
  return (
    <style>{`
      @media print {
        /* Hide everything except the agreement */
        body * {
          visibility: hidden;
        }
        
        /* Show only the agreement document */
        .bg-white.shadow-lg, 
        .bg-white.shadow-lg * {
          visibility: visible;
        }
        
        .bg-white.shadow-lg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          box-shadow: none !important;
          margin: 0;
          padding: 0;
        }
        
        /* Hide buttons and interactive elements */
        button {
          display: none !important;
        }
        
        /* Ensure proper page breaks */
        .signature-block {
          page-break-inside: avoid;
        }
        
        /* Print-specific styling */
        .bg-gradient-to-r {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        /* Maintain colors in print */
        .bg-blue-50,
        .bg-gray-50,
        .bg-yellow-50 {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        /* Signature borders */
        .signature-block .border-2 {
          border: 2px solid #000 !important;
        }
        
        /* Text styling for print */
        body {
          font-size: 11pt;
          line-height: 1.5;
        }
        
        h3, h4 {
          color: #000 !important;
        }
        
        /* Ensure signature images print */
        img {
          max-width: 100%;
          page-break-inside: avoid;
        }
        
        /* Professional spacing */
        .space-y-6 > * + *,
        .space-y-4 > * + *,
        .space-y-3 > * + * {
          margin-top: 1rem;
        }
        
        /* Page margins */
        @page {
          margin: 1in;
        }
      }
    `}</style>
  );
};

export default PrintStyles;

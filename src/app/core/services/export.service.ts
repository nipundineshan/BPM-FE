import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToCSV(data: any[], filename: string, headers: string[]) {
    const csvContent = this.convertToCSV(data, headers);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF(data: any[], filename: string, headers: string[], title: string) {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    (doc as any).autoTable({
      head: [headers],
      body: data.map(obj => Object.values(obj)),
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 9 }
    });

    doc.save(`${filename}.pdf`);
  }

  private convertToCSV(data: any[], headers: string[]): string {
    const rows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const val = row[header.toLowerCase().replace(' ', '')] ?? '';
          return `"${val}"`;
        }).join(',')
      )
    ];
    return rows.join('\r\n');
  }
}

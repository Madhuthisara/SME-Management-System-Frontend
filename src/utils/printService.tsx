import React from 'react';
import { createRoot } from 'react-dom/client';
import { Order } from '../types/order';
import ReceiptTemplate from '../components/printing/ReceiptTemplate';
import InvoiceTemplate from '../components/printing/InvoiceTemplate';

let printRoot: any = null;

/**
 * Modern printing utility that uses React components and global styles
 */
export const printOrder = (order: Order, type: 'receipt' | 'invoice') => {
    // 1. Prepare/Get the print container
    let printSection = document.getElementById('print-section');
    if (!printSection) {
        printSection = document.createElement('div');
        printSection.id = 'print-section';
        document.body.appendChild(printSection);
    }

    // 2. Initialize or get the React root
    if (!printRoot) {
        printRoot = createRoot(printSection);
    }

    // 3. Render the correct template
    const Template = type === 'receipt' ? ReceiptTemplate : InvoiceTemplate;
    printRoot.render(<Template order={order} />);

    // 4. Trigger print after a short delay for rendering
    setTimeout(() => {
        window.print();
    }, 500);
};

/**
 * Fallback or for cases where a raw HTML string is still needed
 */
export const printHTML = (html: string) => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
    }
};

/**
 * Downloads a file (generic utility)
 */
export const downloadFile = (content: string, fileName: string, type: string = 'text/html') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

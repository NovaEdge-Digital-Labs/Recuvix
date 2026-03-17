/**
 * Simple invoice generator utility.
 * In a real-world production app, this would use a library like jspdf 
 * or generate a PDF on the server. For this MVP, we generate a clean 
 * HTML-based printable invoice.
 */

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  packName: string;
  credits: number;
  amount: number;
  currency: string;
  transactionId: string;
}

export function downloadInvoice(data: InvoiceData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${data.invoiceNumber}</title>
      <style>
        body { font-family: sans-serif; color: #333; line-height: 1.6; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .details { margin-top: 30px; display: flex; justify-content: space-between; }
        .table { width: 100%; margin-top: 40px; border-collapse: collapse; }
        .table th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .total { margin-top: 30px; text-align: right; font-size: 18px; font-weight: bold; }
        .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div class="logo">Recuvix</div>
          <div>
            <strong>Invoice #:</strong> ${data.invoiceNumber}<br>
            <strong>Date:</strong> ${data.date}
          </div>
        </div>
        
        <div class="details">
          <div>
            <strong>Billed To:</strong><br>
            ${data.customerName}<br>
            ${data.customerEmail}
          </div>
          <div>
            <strong>Provider:</strong><br>
            Recuvix AI Solutions<br>
            support@recuvix.in
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Credits</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${data.packName}</td>
              <td>${data.credits}</td>
              <td>${data.currency} ${data.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="total">
          Total Paid: ${data.currency} ${data.amount.toFixed(2)}
        </div>

        <div class="footer">
          Thank you for choosing Recuvix. Transaction ID: ${data.transactionId}
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recuvix_invoice_${data.invoiceNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

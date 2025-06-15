import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import type { InvoiceData } from "@/pages/invoice-generator";

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

export default function InvoicePreview({ invoiceData }: InvoicePreviewProps) {
  const handleGeneratePDF = () => {
    generateInvoicePDF(invoiceData);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('et-EE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900">Invoice Preview</CardTitle>
          <Button
            onClick={handleGeneratePDF}
            className="bg-red-600 hover:bg-red-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Invoice Document */}
        <div className="border border-gray-300 bg-white p-8 min-h-[800px]" id="invoice-preview">
          {/* Invoice Header */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-gray-900">
              Invoice nr {invoiceData.invoiceNumber}
            </h1>
          </div>

          {/* Date Information */}
          <div className="text-right mb-8">
            <div className="text-sm text-gray-600 space-y-1">
              <div>Date: {formatDate(invoiceData.invoiceDate)}</div>
              <div>Payment term: {formatDate(invoiceData.paymentTerm)}</div>
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Sender (Fixed) */}
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">
                TETON PRODUCTIONS OÜ
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Kullerkupu 20, Verijärve küla,</div>
                <div>Võrumaa, Võru vald 65541</div>
                <div>Reg. nr.: 14695419</div>
                <div>KMKR nr: EE102643996</div>
              </div>
            </div>
            
            {/* Recipient */}
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">
                INVOICE RECIPIENT
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{invoiceData.recipientCompanyName || "Company Name"}</div>
                <div style={{ whiteSpace: 'pre-line' }}>
                  {invoiceData.recipientAddress || "Address"}
                </div>
                <div>Reg. nr.: {invoiceData.recipientRegNumber || "Registration Number"}</div>
                {invoiceData.recipientVatNumber && (
                  <div>KMKR nr.: {invoiceData.recipientVatNumber}</div>
                )}
              </div>
            </div>
          </div>

          {/* Service Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 text-sm font-medium text-gray-900">
                    DESCRIPTION
                  </th>
                  <th className="text-center py-2 text-sm font-medium text-gray-900">
                    AMOUNT
                  </th>
                  <th className="text-right py-2 text-sm font-medium text-gray-900">
                    PRICE
                  </th>
                  <th className="text-right py-2 text-sm font-medium text-gray-900">
                    SUM
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.serviceItems.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 text-sm text-gray-700">
                      {item.description || "Service description"}
                    </td>
                    <td className="py-2 text-sm text-gray-700 text-center">
                      {item.amount}
                    </td>
                    <td className="py-2 text-sm text-gray-700 text-right">
                      {item.price.toFixed(2)} €
                    </td>
                    <td className="py-2 text-sm text-gray-700 text-right">
                      {(item.amount * item.price).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="text-right space-y-2 mb-12">
            <div className="text-sm">
              <span className="inline-block w-20 ml-[30px] mr-[30px]">SUM</span>
              <span className="font-medium">{invoiceData.subtotal} €</span>
            </div>
            <div className="text-sm">
              <span className="inline-block w-20 ml-[30px] mr-[30px]">VAT 22%</span>
              <span className="font-medium">{invoiceData.vat} €</span>
            </div>
            <div className="text-sm font-semibold border-t border-gray-300 pt-2">
              <span className="inline-block w-20 ml-[30px] mr-[30px]">TOTAL</span>
              <span>{invoiceData.total} €</span>
            </div>
          </div>

          {/* Bank Details */}
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-1">AS LHV PANK</div>
            <div>Bank account number: EE437700771003739128</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

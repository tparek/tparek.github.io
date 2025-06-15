import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { InvoiceData } from "@/pages/invoice-generator";
import type { ServiceItem } from "@shared/schema";

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: (data: InvoiceData | ((prev: InvoiceData) => InvoiceData)) => void;
}

export default function InvoiceForm({ invoiceData, setInvoiceData }: InvoiceFormProps) {
  const addServiceItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      serviceItems: [...prev.serviceItems, { description: "", amount: 1, price: 0 }]
    }));
  };

  const removeServiceItem = (index: number) => {
    if (invoiceData.serviceItems.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        serviceItems: prev.serviceItems.filter((_, i) => i !== index)
      }));
    }
  };

  const updateServiceItem = (index: number, field: keyof ServiceItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      serviceItems: prev.serviceItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Invoice Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invoice Meta Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="invoiceDate" className="text-sm font-medium text-gray-700">
              Invoice Date
            </Label>
            <Input
              id="invoiceDate"
              type="date"
              value={invoiceData.invoiceDate}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceDate: e.target.value }))}
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="paymentTerm" className="text-sm font-medium text-gray-700">
              Payment Term
            </Label>
            <Input
              id="paymentTerm"
              type="date"
              value={invoiceData.paymentTerm}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, paymentTerm: e.target.value }))}
              className="mt-2"
              required
            />
          </div>
        </div>

        {/* Recipient Information */}
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-md font-medium text-gray-900">Invoice Recipient</h3>
          
          <div>
            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
              Company Name
            </Label>
            <Input
              id="companyName"
              value={invoiceData.recipientCompanyName}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, recipientCompanyName: e.target.value }))}
              placeholder="Company Name"
              className="mt-2"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Address
            </Label>
            <Textarea
              id="address"
              value={invoiceData.recipientAddress}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, recipientAddress: e.target.value }))}
              placeholder="Full address"
              rows={3}
              className="mt-2"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="regNumber" className="text-sm font-medium text-gray-700">
                Registration Nr.
              </Label>
              <Input
                id="regNumber"
                value={invoiceData.recipientRegNumber}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, recipientRegNumber: e.target.value }))}
                placeholder="14695419"
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="vatNumber" className="text-sm font-medium text-gray-700">
                VAT Number
              </Label>
              <Input
                id="vatNumber"
                value={invoiceData.recipientVatNumber}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, recipientVatNumber: e.target.value }))}
                placeholder="EE102643996"
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Service Items */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-gray-900">Services & Items</h3>
            <Button
              type="button"
              onClick={addServiceItem}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
          
          {invoiceData.serviceItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-6">
                  <Label className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateServiceItem(index, 'description', e.target.value)}
                    placeholder="Service description"
                    className="mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Amount
                  </Label>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateServiceItem(index, 'amount', parseInt(e.target.value) || 1)}
                    min="1"
                    className="mt-2"
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Price (€)
                  </Label>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateServiceItem(index, 'price', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="mt-2"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    onClick={() => removeServiceItem(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 p-2"
                    disabled={invoiceData.serviceItems.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Calculation Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">€{invoiceData.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (22%):</span>
                <span className="font-medium">€{invoiceData.vat}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-green-600 border-t border-gray-300 pt-2">
                <span>Total:</span>
                <span>€{invoiceData.total}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

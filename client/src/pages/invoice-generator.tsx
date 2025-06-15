import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import InvoiceForm from "@/components/invoice-form";
import InvoicePreview from "@/components/invoice-preview";
import { Button } from "@/components/ui/button";
import { Save, FileText } from "lucide-react";
import type { ServiceItem } from "@shared/schema";

export interface InvoiceData {
  invoiceNumber: number;
  invoiceDate: string;
  paymentTerm: string;
  recipientCompanyName: string;
  recipientAddress: string;
  recipientRegNumber: string;
  recipientVatNumber: string;
  serviceItems: ServiceItem[];
  subtotal: string;
  vat: string;
  total: string;
}

export default function InvoiceGenerator() {
  const { toast } = useToast();
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: 181,
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentTerm: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    recipientCompanyName: "",
    recipientAddress: "",
    recipientRegNumber: "",
    recipientVatNumber: "",
    serviceItems: [{ description: "", amount: 1, price: 0 }],
    subtotal: "0.00",
    vat: "0.00",
    total: "0.00",
  });

  // Get next invoice number
  const { data: invoiceNumberData } = useQuery({
    queryKey: ["/api/invoice-number"],
  });

  // Update invoice number when data is loaded
  useEffect(() => {
    if (invoiceNumberData?.nextInvoiceNumber) {
      setInvoiceData(prev => ({
        ...prev,
        invoiceNumber: invoiceNumberData.nextInvoiceNumber
      }));
    }
  }, [invoiceNumberData]);

  // Calculate totals whenever service items change
  useEffect(() => {
    const subtotal = invoiceData.serviceItems.reduce((sum, item) => {
      return sum + (item.amount * item.price);
    }, 0);
    
    const vat = subtotal * 0.22;
    const total = subtotal + vat;
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal: subtotal.toFixed(2),
      vat: vat.toFixed(2),
      total: total.toFixed(2),
    }));
  }, [invoiceData.serviceItems]);

  // Save invoice mutation
  const saveInvoiceMutation = useMutation({
    mutationFn: async (data: Omit<InvoiceData, 'subtotal' | 'vat' | 'total'>) => {
      const response = await apiRequest("POST", "/api/invoices", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Invoice Saved",
        description: `Invoice #${invoiceData.invoiceNumber} has been saved successfully.`,
      });
      
      // Update next invoice number and reset form
      setInvoiceData(prev => ({
        invoiceNumber: data.nextInvoiceNumber,
        invoiceDate: new Date().toISOString().split('T')[0],
        paymentTerm: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        recipientCompanyName: "",
        recipientAddress: "",
        recipientRegNumber: "",
        recipientVatNumber: "",
        serviceItems: [{ description: "", amount: 1, price: 0 }],
        subtotal: "0.00",
        vat: "0.00",
        total: "0.00",
      }));
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/invoice-number"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save invoice. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    // Validate required fields
    if (!invoiceData.recipientCompanyName || !invoiceData.recipientAddress || !invoiceData.recipientRegNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required recipient fields.",
        variant: "destructive",
      });
      return;
    }

    if (invoiceData.serviceItems.some(item => !item.description || item.amount < 1 || item.price < 0)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all service item fields correctly.",
        variant: "destructive",
      });
      return;
    }

    const { subtotal, vat, total, ...dataToSave } = invoiceData;
    saveInvoiceMutation.mutate(dataToSave);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="text-blue-600 text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Teton Productions - Invoice Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Next Invoice: #{invoiceData.invoiceNumber}
              </span>
              <Button 
                onClick={handleSave}
                disabled={saveInvoiceMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveInvoiceMutation.isPending ? "Saving..." : "Save Invoice"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InvoiceForm 
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
          />
          <InvoicePreview 
            invoiceData={invoiceData}
          />
        </div>
      </div>
    </div>
  );
}

namespace Ovi.Task.Data.DAO
{
    public class SalesInvoicePspItem
    {
        public int Psp { get; set; }

    }

    public class SalesInvoicePsp
    {
        public int SalesInvoice { get; set; }

        public SalesInvoicePspItem[] Items { get; set; }
    }
}
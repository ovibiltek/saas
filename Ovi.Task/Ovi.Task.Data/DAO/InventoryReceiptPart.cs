namespace Ovi.Task.Data.DAO
{
    public class InventoryReceiptPart
    {
        public long Transaction { get; set; }
        public string Type { get; set; }
        public string Warehouse { get; set; }
        public long Part { get; set; }
        public string Bin { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }

    }
}

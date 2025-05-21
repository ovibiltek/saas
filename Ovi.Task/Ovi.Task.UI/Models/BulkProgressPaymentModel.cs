using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.UI.Models
{
    public class BulkProgressPaymentModel
    {
        public string InvoiceOption;
        public string InvoiceDescription;
        public string InvoiceNo;
        public string OrderNo;
        public DateTime? InvoiceDate;
        public string PrintType;
        public string Status;
        public long[] Lines;
        public string AllowZeroTotal;
    }
}
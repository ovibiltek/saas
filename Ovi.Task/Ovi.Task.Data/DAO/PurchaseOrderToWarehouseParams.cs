using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.DAO
{
    public class PurchaseOrderToWarehouseParams
    {
        public long PTW_PORID { get; set; }
        public long PTW_LINE { get; set; }
        public long PTW_PART { get; set; }
        public decimal PTW_REMAINING { get; set; }
        public decimal PTW_EXCH { get; set; }
        public decimal PTW_UOMMULTI { get; set; }
        public decimal PTW_UNITPRICE { get; set; }
        public string PTW_WAREHOUSE { get; set; }
        public string PTW_WAYBILL { get; set; }
    }
}

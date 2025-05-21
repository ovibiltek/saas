using System;

namespace Ovi.Task.Data.Entity
{
    public class TMWAREHOUSES
    {
        public virtual string WAH_CODE { get; set; }

        public virtual string WAH_DESC { get; set; }

        public virtual string WAH_DESCF { get; set; }

        public virtual string WAH_ORG { get; set; }

        public virtual string WAH_ORGDESC { get; set; }

        public virtual string WAH_FULLADDRESS { get; set; }

        public virtual string WAH_PRICINGMETHOD { get; set; }

        public virtual string WAH_PARENT { get; set; }

        public virtual string WAH_PARENTDESC { get; set; }

        public virtual string WAH_WAREHOUSEMAN { get; set; }

        public virtual string WAH_WAREHOUSEMANDESC { get; set; }

        public virtual string WAH_WAREHOUSEMANGROUP{ get; set; }

        public virtual string WAH_TOOL { get; set; }

        public virtual char WAH_ACTIVE { get; set; }

        public virtual char WAH_PUBLIC { get; set; }

        public virtual DateTime WAH_CREATED { get; set; }

        public virtual DateTime? WAH_UPDATED { get; set; }

        public virtual string WAH_CREATEDBY { get; set; }

        public virtual string WAH_UPDATEDBY { get; set; }

        public virtual int WAH_RECORDVERSION { get; set; }
    }
}
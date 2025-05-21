using System;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMEQUIPMENTMAINPRICES
    {
        public virtual int EMP_ID { get; set; }
        public virtual string EMP_EQUIPMENTTYPE { get; set; }
        public virtual string EMP_EQUIPMENTTYPEENTITY { get; set; }
        public virtual string EMP_TYPEDESC { get; set; }
        public virtual string EMP_PERIODICTASK { get; set; }
        public virtual string EMP_PERIODICTASKDESC { get; set; }
        public virtual string EMP_ORG { get; set; }
        public virtual string EMP_ORGDESC { get; set; }
        public virtual decimal EMP_UNITPURCHASEPRICE { get; set; }
        public virtual decimal EMP_UNITSALESPRICE { get; set; }
        public virtual string EMP_CURR { get; set; }
        public virtual string EMP_CURRDESC { get; set; }
        public virtual char EMP_ACTIVE { get; set; }
        public virtual DateTime EMP_CREATED { get; set; }
        public virtual string EMP_CREATEDBY { get; set; }
        public virtual DateTime? EMP_UPDATED { get; set; }
        public virtual string EMP_UPDATEDBY { get; set; }
        public virtual int EMP_RECORDVERSION { get; set; }
    }
}
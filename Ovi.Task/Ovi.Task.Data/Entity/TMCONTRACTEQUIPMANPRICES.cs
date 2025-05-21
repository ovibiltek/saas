using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCONTRACTEQUIPMANPRICES
    {
        public virtual int CMP_ID { get; set; }

        public virtual int CMP_CONTRACTID { get; set; }

        public virtual string CMP_CUSTOMER { get; set; }

        public virtual string CMP_PTKCODE { get; set; }

        public virtual string CMP_PTKDESC { get; set; }

        public virtual string CMP_EQUIPMENTTYPEENTITY { get; set; }

        public virtual string CMP_EQUIPMENTTYPE { get; set; }

        public virtual string CMP_EQUIPMENTTYPEDESC { get; set; }

        public virtual string CMP_REGION { get; set; }

        public virtual string CMP_REGIONDESC { get; set; }

        public virtual string CMP_BRANCH { get; set; }

        public virtual string CMP_BRANCHDESC { get; set; }

        public virtual string CMP_REFERENCE { get; set; }

        public virtual int? CMP_EQUIPMENTID { get; set; }

        public virtual string CMP_EQUIPMENTIDDESC { get; set; }

        public virtual decimal CMP_UNITPURCHASEPRICE { get; set; }

        public virtual decimal CMP_UNITSALESPRICE { get; set; }

        public virtual string CMP_CURRENCY { get; set; }

        public virtual string CMP_CURRENCYDESC { get; set; }

        public virtual DateTime CMP_CREATED { get; set; }

        public virtual string CMP_CREATEDBY { get; set; }

        public virtual DateTime? CMP_UPDATED { get; set; }

        public virtual string CMP_UPDATEDBY { get; set; }

        public virtual int CMP_RECORDVERSION { get; set; }
    }
}
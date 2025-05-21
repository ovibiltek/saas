using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPSPLINESWITHCOSTVIEW
    {
        public virtual int PPL_ID { get; set; }

        public virtual int PPL_PSPCODE { get; set; }

        public virtual string PPL_PSPDESC { get; set; }

        public virtual string PPL_PRPCODE { get; set; }

        public virtual string PPL_PRPLABORTYPE { get; set; }

        public virtual decimal PPL_PRPSERVICEFEE { get; set; }

        public virtual decimal PLP_PRPHOURLYFEE { get; set; }

        public virtual decimal PLP_PRPCRITICALTIMEVALUE { get; set; }

        public virtual string PLP_PRPCURRENCY { get; set; }

        public virtual string PPL_PSPORG { get; set; }

        public virtual string PPL_PSPSTADESC { get; set; }

        public virtual int PPL_TASK { get; set; }

        public virtual string PPL_TASKSHORTDESC { get; set; }

        public virtual string PPL_TASKTYPE { get; set; }

        public virtual string PPL_TASKTYPEDESC { get; set; }

        public virtual string PPL_TSKTASKTYPE { get; set; }

        public virtual string PPL_TASKCATEGORY { get; set; }

        public virtual string PPL_TASKCATEGORYDESC { get; set; }

        public virtual string PPL_CUSTOMER { get; set; }

        public virtual string PPL_CUSTOMERDESC { get; set; }

        public virtual string PPL_CUSTOMERGROUP { get; set; }

        public virtual string PPL_CUSTOMERGROUPDESC { get; set; }

        public virtual string PPL_BRANCH { get; set; }

        public virtual string PPL_BRANCHDESC { get; set; }

        public virtual string PPL_BRNAUTHORIZED { get; set; }

        public virtual string PPL_BRANCHREGION { get; set; }

        public virtual string PPL_BRANCHPROVINCE { get; set; }

        public virtual string PPL_TRADE { get; set; }

        public virtual int PPL_TSKACTLINE { get; set; }

        public virtual string PPL_TYPE { get; set; }

        public virtual string PPL_TYPEDESC { get; set; }

        public virtual decimal? PPL_QTY { get; set; }

        public virtual string PPL_UOM { get; set; }

        public virtual decimal PPL_UNITPURCHASEPRICE { get; set; }

        public virtual decimal? PPL_TOTALPURCHASEPRICE { get; set; }

        public virtual decimal? PPL_UNITSALESPRICE { get; set; }

        public virtual decimal? PPL_TOTALSALESPRICE { get; set; }

        public virtual string PPL_CURR { get; set; }

        public virtual DateTime PPL_TSKCREATED { get; set; }

        public virtual DateTime? PPL_TSKCOMPLETED { get; set; }

        public virtual DateTime? PPL_TSKCLOSED { get; set; }

        public virtual DateTime PPL_PSPCREATED { get; set; }

        public virtual string PPL_TSKREFERENCE { get; set; }

        public virtual char PPL_HASINVOICE { get; set; }
    }
}
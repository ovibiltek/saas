using System;

namespace Ovi.Task.Data.Entity.Quotation
{
    public class TMQUOTATIONSVIEW
    {
        public virtual int QUO_ID { get; set; }

        public virtual string QUO_ORGANIZATION { get; set; }

        public virtual string QUO_ORGANIZATIONDESC { get; set; }

        public virtual string QUO_TYPEENTITY { get; set; }

        public virtual string QUO_TYPE { get; set; }

        public virtual string QUO_TYPEDESC { get; set; }

        public virtual string QUO_DESCRIPTION { get; set; }

        public virtual int QUO_REVNO { get; set; }

        public virtual string QUO_REFERENCENO { get; set; }

        public virtual string QUO_SUPPLIER { get; set; }

        public virtual string QUO_SUPPLIERDESC { get; set; }

        public virtual int? QUO_TASK { get; set; }

        public virtual int? QUO_ACTIVITY { get; set; }

        public virtual int? QUO_PROJECT { get; set; }

        public virtual string QUO_PROJECTDESC { get; set; }

        public virtual string QUO_MANAGER { get; set; }

        public virtual string QUO_PM { get; set; }

        public virtual string QUO_PMDESC { get; set; }

        public virtual DateTime? QUO_SUPPLYPERIOD { get; set; }

        public virtual int? QUO_REMINDINGPERIOD { get; set; }

        public virtual string QUO_STATUSENTITY { get; set; }

        public virtual string QUO_STATUS { get; set; }

        public virtual string QUO_STATUSDESC { get; set; }

        public virtual string QUO_CANCELLATIONREASON { get; set; }

        public virtual string QUO_CANCELLATIONREASONDESC { get; set; }

        public virtual string QUO_REJECTREASON { get; set; }

        public virtual string QUO_REJECTREASONDESC { get; set; }

        public virtual int? QUO_PAYMENTDUE { get; set; }

        public virtual DateTime QUO_CREATED { get; set; }

        public virtual string QUO_CREATEDBY { get; set; }

        public virtual DateTime? QUO_UPDATED { get; set; }

        public virtual string QUO_UPDATEDBY { get; set; }

        public virtual int QUO_RECORDVERSION { get; set; }

        public virtual decimal? QUO_PARTPURCHASE { get; set; }

        public virtual decimal? QUO_PARTSALES { get; set; }

        public virtual decimal? QUO_PARTPURCHASE_ORGCURR { get; set; }

        public virtual decimal? QUO_PARTSALES_ORGCURR { get; set; }

        public virtual decimal? QUO_SERVICEPURCHASE { get; set; }

        public virtual decimal? QUO_SERVICESALES { get; set; }

        public virtual decimal? QUO_SERVICEPURCHASE_ORGCURR { get; set; }

        public virtual decimal? QUO_SERVICESALES_ORGCURR { get; set; }

        public virtual decimal? QUO_TOTALPURCHASE { get; set; }

        public virtual decimal? QUO_TOTALSALES { get; set; }

        public virtual decimal? QUO_TOTALPURCHASE_ORGCURR { get; set; }

        public virtual decimal? QUO_TOTALSALES_ORGCURR { get; set; }

        public virtual string QUO_ORGANIZATIONCURR { get; set; }

        public virtual string QUO_TASKDESC { get; set; }

        public virtual string QUO_TASKREFERENCE { get; set; }

        public virtual string QUO_MANAGERDESC { get; set; }

        public virtual string QUO_CUSTOMER { get; set; }

        public virtual string QUO_CUSTOMERDESC { get; set; }

        public virtual string QUO_BRANCH { get; set; }

        public virtual string QUO_BRANCHDESC { get; set; }

        public virtual string QUO_BRANCHREFERENCE { get; set; }

        public virtual string QUO_LOCATION { get; set; }

        public virtual string QUO_LOCATIONDESC { get; set; }

        public virtual int QUO_ORDER { get; set; }

        public virtual int QUO_COUNT { get; set; }

        public virtual string QUO_CURR { get; set; }

        public virtual string QUO_CURRDESC { get; set; }

        public virtual decimal QUO_EXCH { get; set; }

        public virtual char QUO_PURCHASEORDER { get; set; }

        public virtual char QUO_PURCHASEORDERREQ { get; set; }

        public virtual int? QUO_CONTRACT { get; set; }

        public virtual int? QUO_VALIDITYPERIOD { get; set; }

        public virtual DateTime? QUO_ACTSCHTO { get; set; }

    }
}
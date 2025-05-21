using System;
namespace Ovi.Task.Data.Entity
{
    public class TMPURCHASEREQUESTPOVIEW
    {
        public virtual int PQL_ID { get; set; }
        public virtual int PQL_REQ { get; set; }
        public virtual int PQL_LINE { get; set; }
        public virtual int PQL_PARTID { get; set; }
        public virtual string PQL_PARTNOTE { get; set; }
        public virtual string PQL_PARTCODE { get; set; }
        public virtual string PQL_PARTCURR { get; set; }
        public virtual string PQL_PARTDESC { get; set; }
        public virtual decimal PQL_QUANTITY { get; set; }
        public virtual string PQL_REQUESTEDUOM { get; set; }
        public virtual decimal PQL_UOMMULTI { get; set; }
        public virtual DateTime PQL_REQUESTEDDATE { get; set; }
        public virtual decimal PQL_UNITPRICE { get; set; }
        public virtual string PQL_CURRENCY { get; set; }
        public virtual decimal PQL_EXCHANGERATE { get; set; }
        public virtual decimal? PQL_VATTAX { get; set; }
        public virtual decimal? PQL_TAX2 { get; set; }
        public virtual DateTime PQL_CREATED { get; set; }
        public virtual string PQL_CREATEDBY { get; set; }
        public virtual DateTime? PQL_UPDATED { get; set; }
        public virtual string PQL_UPDATEDBY { get; set; }
        public virtual int PQL_RECORDVERSION { get; set; }
        public virtual int? PQL_POID { get; set; }
        public virtual string PQL_PODESC { get; set; }
        public virtual string PQL_POORG { get; set; }
        public virtual string PQL_POTYPEENTITY { get; set; }
        public virtual string PQL_POTYPE { get; set; }
        public virtual string PQL_POSTATUS { get; set; }
        public virtual string PQL_POSTATUSENTITY { get; set; }
        public virtual int? PQL_POTASK { get; set; }
        public virtual string PQL_POCANCELLATIONREASON { get; set; }
        public virtual string PQL_POWAREHOUSE { get; set; }
        public virtual string PQL_POREQUESTEDBY { get; set; }
        public virtual DateTime? PQL_POREQUESTED { get; set; }
        public virtual string PQL_POSUPPLIER { get; set; }
        public virtual string PQL_POCURRENCY { get; set; }
        public virtual string PQL_POPAYMENTTERM { get; set; }
        public virtual decimal? PQL_POEXCHANGERATE { get; set; }
        public virtual string PQL_PODELIVERYADR { get; set; }
        public virtual DateTime? PQL_POCREATED { get; set; }
        public virtual string PQL_POCREATEDBY { get; set; }
        public virtual DateTime? PQL_POUPDATED { get; set; }
        public virtual string PQL_POUPDATEDBY { get; set; }
        public virtual int? PQL_PORECORDVERSION { get; set; }
    }
}
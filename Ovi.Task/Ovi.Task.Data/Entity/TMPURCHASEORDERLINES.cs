using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPURCHASEORDERLINES
    {
        public virtual long PRL_ID { get; set; }

        public virtual long PRL_PORID { get; set; }

        public virtual int PRL_LINE { get; set; }

        public virtual long PRL_PARTID { get; set; }

        public virtual string PRL_PARTNOTE { get; set; }

        public virtual string PRL_PARTCODE { get; set; }

        public virtual string PRL_PARTCURR { get; set; }

        public virtual string PRL_PARTDESC { get; set; }

        public virtual decimal PRL_QUANTITY { get; set; }

        public virtual string PRL_PARUOM { get; set; }

        public virtual string PRL_REQUESTEDUOM { get; set; }

        public virtual string PRL_REQUESTEDUOMDESC { get; set; }

        public virtual decimal PRL_UOMMULTI { get; set; }

        public virtual DateTime PRL_REQUESTEDDATE { get; set; }

        public virtual decimal PRL_UNITPRICE { get; set; }

        public virtual string PRL_CURRENCY { get; set; }

        public virtual decimal PRL_EXCHANGERATE { get; set; }

        public virtual decimal? PRL_VATTAX { get; set; }

        public virtual decimal? PRL_TAX2 { get; set; }

        public virtual decimal PRL_DISCOUNT { get; set; }

        public virtual string PRL_CARGOCOMPANY { get; set; }

        public virtual DateTime? PRL_CARGODATE { get; set; }

        public virtual string PRL_CARGONUMBER { get; set; }

        public virtual long? PRL_REQ { get; set; }

        public virtual long? PRL_REQLINEID { get; set; }

        public virtual int? PRL_REQLINE { get; set; }

        public virtual long? PRL_QUOTATION { get; set; }

        public virtual long? PRL_TASKACTIVITY { get; set; }

        public virtual long? PRL_TASKACTIVITYLINE{ get; set; }

        public virtual decimal? PRL_TOTALVAT { get; set; }

        public virtual decimal? PRL_DISCOUNTEDUNITPRICE { get; set; }

        public virtual decimal? PRL_DISCOUNTEDTOTALPRICE { get; set; }

        public virtual decimal? PRL_GRANDTOTAL { get; set; }

        public virtual long? PRL_TASK { get; set; }

        public virtual DateTime PRL_CREATED { get; set; }

        public virtual string PRL_CREATEDBY { get; set; }

        public virtual DateTime? PRL_UPDATED { get; set; }

        public virtual string PRL_UPDATEDBY { get; set; }

        public virtual int PRL_RECORDVERSION { get; set; }


    }
}
using Ovi.Task.Data.Configuration;
using System;

namespace Ovi.Task.Data.Entity
{
    public class TMREPORTINGVIEW
    {
        public virtual int REP_ID { get; set; }

        public virtual string REP_DESC { get; set; }

        public virtual string REP_ORG { get; set; }

        public virtual string REP_ORGDESC { get; set; }

        public virtual string REP_TYPE { get; set; }

        public virtual string REP_TYPEENTITY { get; set; }

        public virtual string REP_TYPEDESC { get; set; }

        public virtual string REP_STATUS { get; set; }

        public virtual string REP_STATUSENTITY { get; set; }

        public virtual string REP_STATUSDESC { get; set; }

        public virtual int REP_TSK { get; set; }

        public virtual string REP_TSKDESC { get; set; }

        public virtual string REP_SUPPLIER { get; set; }

        public virtual string REP_SUPPLIERDESC { get; set; }

        public virtual string REP_TSKASSIGNEDTO { get; set; }

        public virtual string REP_TSKACTTRADE { get; set; }

        public virtual DateTime REP_CREATED { get; set; }

        public virtual string REP_CREATEDBY { get; set; }

        public virtual DateTime? REP_UPDATED { get; set; }

        public virtual string REP_UPDATEDBY { get; set; }

        [ExcludedWhenExport]
        public virtual int REP_DOCCNT { get; set; }

        [ExcludedWhenExport]
        public virtual int REP_CMNTCNT { get; set; }

        public virtual int REP_RECORDVERSION { get; set; }

        public virtual string REP_CUSCODE { get; set; }

        public virtual string REP_CUSDESC { get; set; }

        public virtual string REP_BRNCODE { get; set; }

        public virtual string REP_BRNDESC { get; set; }

        public virtual string REP_BRNREGION { get; set; }

        public virtual string REP_TSKSTATUS { get; set; }

        public virtual string REP_TSKSTATUSDESC { get; set; }

        public virtual string REP_TSKCATEGORY { get; set; }

        public virtual string REP_TSKCATEGORYDESC { get; set; }

        public virtual string REP_REGIONREPORTINGRESPONSIBLE { get; set; }

        public virtual string REP_CUSTOMERREPORTINGRESPONSIBLE { get; set; }
    }
}
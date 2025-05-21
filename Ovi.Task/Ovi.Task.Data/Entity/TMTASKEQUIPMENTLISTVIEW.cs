using Ovi.Task.Data.Configuration;
using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTASKEQUIPMENTLISTVIEW
    {
        public virtual long TSE_ID { get; set; }

        public virtual long TSE_TSKID { get; set; }

        public virtual string TSE_TSKDESC { get; set; }

        public virtual string TSE_TSKCAT { get; set; }

        public virtual string TSE_TSKCATDESC { get; set; }

        public virtual string TSE_TSKTYPE { get; set; }

        public virtual string TSE_TYPE { get; set; }

        public virtual string TSE_CUSTOMER { get; set; }

        public virtual string TSE_BRANCH { get; set; }

        public virtual string TSE_BRANCHDESC { get; set; }

        public virtual DateTime TSE_CREATED { get; set; }

        public virtual DateTime? TSE_COMPLETED { get; set; }

        public virtual DateTime? TSE_DATE { get; set; }

        public virtual DateTime? TSE_ACTPLANDATE { get; set; }

        public virtual int TSE_EQPID { get; set; }

        [ExcludedWhenExport]
        public virtual int TSE_DOCCOUNT { get; set; }

        [ExcludedWhenExport]
        public virtual int TSE_CMNTCOUNT { get; set; }

        public virtual string TSE_EQPCODE { get; set; }

        public virtual string TSE_EQPTYPE { get; set; }

        public virtual string TSE_EQPDESC { get; set; }

        public virtual string TSE_STATUS { get; set; }

        public virtual string TSE_STATUSDESC { get; set; }

        public virtual string TSE_EQPBRAND { get; set; }

        public virtual int? TSE_EQPMANUFACTURINGYEAR { get; set; }

        public virtual string TSE_EQPKAP { get; set; }

    }
}
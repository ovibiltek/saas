using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TM_TASKACTIVITYDURATIONSMAP
    {
        public virtual long ACT_ID { get; set; }

        public virtual long ACT_TASK { get; set; }

        public virtual long ACT_LINE { get; set; }

        public virtual string ACT_DURTRADE { get; set; }

        public virtual DateTime? ACT_DURSTART { get; set; }

        public virtual string ACT_DURSTARTTYPE { get; set; }

        public virtual DateTime? ACT_DUREND { get; set; }

        public virtual string ACT_DURENDDTYPE { get; set; }

        public virtual string ACT_DURSTARTLAT { get; set; }

        public virtual string ACT_DURSTARTLNG { get; set; }

        public virtual string ACT_DURENDLAT { get; set; }

        public virtual string ACT_DURENDLNG { get; set; }

        public virtual string ACT_LOCLATITUDE { get; set; }

        public virtual string ACT_LOCLONGITUDE { get; set; }

        public virtual string ACT_TSKCATEGORY { get; set; }

        public virtual string ACT_LOCDESC { get; set; }

        public virtual string ACT_DESC { get; set; }

        public virtual DateTime? ACT_SCHFROM { get; set; }

        public virtual DateTime? ACT_SCHTO { get; set; }

        public virtual string ACT_CUSCODE { get; set; }

        public virtual string ACT_CUSDESC { get; set; }

        public virtual string ACT_BRNDESC { get; set; }

        public virtual string ACT_TRADE { get; set; }

        public virtual string ACT_TRADEUSRS { get; set; }

        public virtual long ACT_ROWNUM { get; set; }
    }
}
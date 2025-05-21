using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPERIODICTASKS
    {
        public virtual string PTK_CODE { get; set; }

        public virtual string PTK_DESC { get; set; }

        public virtual string PTK_DESCF { get; set; }

        public virtual string PTK_ORGANIZATION { get; set; }

        public virtual string PTK_ORGANIZATIONDESC { get; set; }

        public virtual string PTK_TYPEENTITY { get; set; }

        public virtual string PTK_TYPE { get; set; }

        public virtual string PTK_TYPEDESC { get; set; }

        public virtual string PTK_TASKTYPE { get; set; }

        public virtual string PTK_TASKTYPEDESC { get; set; }

        public virtual string PTK_CATEGORY { get; set; }

        public virtual string PTK_CATEGORYDESC { get; set; }

        public virtual int PTK_FREQUENCY { get; set; }

        public virtual string PTK_FREQUENCYPART { get; set; }

        public virtual string PTK_PRIORITY { get; set; }

        public virtual string PTK_PRIORITYDESC { get; set; }

        public virtual char PTK_IGNOREMONDAYS { get; set; }

        public virtual char PTK_IGNORETUESDAYS { get; set; }

        public virtual char PTK_IGNOREWEDNESDAYS { get; set; }

        public virtual char PTK_IGNORETHURSDAYS { get; set; }

        public virtual char PTK_IGNOREFRIDAYS { get; set; }

        public virtual char PTK_IGNORESATURDAYS { get; set; }

        public virtual char PTK_IGNORESUNDAYS { get; set; }

        public virtual char PTK_IGNOREOFFICIALHOLIDAYS { get; set; }

        public virtual int? PTK_RFREQUENCY { get; set; }

        public virtual string PTK_RFREQUENCYPART { get; set; }

        public virtual char PTK_AUTOCREATE { get; set; }

        public virtual int? PTK_AUTOCREATIONTIME { get; set; }

        public virtual char PTK_ACTIVE { get; set; }

        public virtual DateTime PTK_CREATED { get; set; }

        public virtual DateTime? PTK_UPDATED { get; set; }

        public virtual string PTK_CREATEDBY { get; set; }

        public virtual string PTK_UPDATEDBY { get; set; }

        public virtual int PTK_SQLIDENTITY { get; set; }

        public virtual int PTK_RECORDVERSION { get; set; }
    }
}
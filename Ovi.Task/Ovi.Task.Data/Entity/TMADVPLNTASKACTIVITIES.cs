using System;namespace Ovi.Task.Data.Entity{    public class TMADVPLNTASKACTIVITIES    {        public virtual long TSA_ID { get; set; }
        public virtual long TSA_TASK { get; set; }
        public virtual string TSK_SHORTDESC { get; set; }
        public virtual string TSK_ORGANIZATION { get; set; }
        public virtual string TSK_ORGANIZATIONDESC { get; set; }
        public virtual string TSK_PROJECT { get; set; }
        public virtual string TSK_STATUS { get; set; }
        public virtual string TSK_STATUSDESC { get; set; }
        public virtual string PRJ_DESC { get; set; }
        public virtual string TSK_DEPARTMENT { get; set; }
        public virtual DateTime? TSK_DEADLINE { get; set; }
        public virtual string TSK_TYPE { get; set; }
        public virtual string TSK_TYPEDESC { get; set; }
        public virtual string TSK_CATEGORY { get; set; }
        public virtual string TSK_CATEGORYDESC { get; set; }
        public virtual string CUS_CODE { get; set; }
        public virtual string CUS_DESC { get; set; }
        public virtual string BRN_CODE { get; set; }
        public virtual string BRN_DESC { get; set; }
        public virtual long TSA_LINE { get; set; }
        public virtual string TSA_DESC { get; set; }
        public virtual string TSK_PRIORITY { get; set; }
        public virtual string TSA_CREATEDBY { get; set; }
        public virtual DateTime TSA_CREATED { get; set; }
        public virtual DateTime TSK_CREATED { get; set; }
        public virtual string TSA_TRADE { get; set; }
        public virtual string TSA_ASSIGNEDTO { get; set; }
        public virtual DateTime? TSA_SCHFROM { get; set; }
        public virtual DateTime? TSA_SCHTO { get; set; }
        public virtual char TSA_PLANNED { get; set; }
        public virtual long TSK_CMNTCOUNT { get; set; }
        public virtual long TSK_DOCCOUNT { get; set; }
        public virtual int TSA_RECORDVERSION { get; set; }    }}
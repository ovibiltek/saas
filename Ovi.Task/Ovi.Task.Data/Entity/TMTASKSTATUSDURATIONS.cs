using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTASKSTATUSDURATIONS
    {
        public virtual int SPR_TSK { get; set; }

        public virtual string SPR_TSKDESC { get; set; }

        public virtual string SPR_TSKORG { get; set; }

        public virtual string SPR_ORGDESC { get; set; }

        public virtual string SPR_CAT { get; set; }

        public virtual string SPR_CATDESC { get; set; }

        public virtual string SPR_TSKTASKTYPE { get; set; }

        public virtual string SPR_TSKTASKTYPEDESC { get; set; }

        public virtual string SPR_CUSTOMER { get; set; }

        public virtual string SPR_BRANCH { get; set; }

        public virtual string SPR_BRANCHDESC { get; set; }

        public virtual DateTime SPR_TSKREQUESTED { get; set; }

        public virtual DateTime SPR_TSKCREATED { get; set; }

        public virtual string SPR_STATUS { get; set; }

        public virtual string SPR_STATUSDESC { get; set; }

        public virtual string SPR_HOLDREASON { get; set; }

        public virtual string SPR_HOLDDEPARTMENT { get; set; }

        public virtual string SPR_OB { get; set; }

        public virtual string SPR_A { get; set; }

        public virtual string SPR_PA { get; set; }

        public virtual string SPR_T { get; set; }

        public virtual string SPR_TAM { get; set; }

        public virtual string SPR_EKM { get; set; }

        public virtual string SPR_BEK { get; set; }

        public virtual string SPR_FINANS { get; set; }

        public virtual string SPR_KALITE { get; set; }

        public virtual string SPR_HAKEDIS { get; set; }

        public virtual string SPR_OPERASYON { get; set; }

        public virtual string SPR_MUSTERIYONETIMI { get; set; }

        public virtual string SPR_SATINALMA { get; set; }

        public virtual string SPR_RAPORLAMA { get; set; }

        public virtual string SPR_TOTAL { get; set; }
        public virtual string SPR_TOTALCLOSED { get; set; }
        public virtual int SPR_TOTALCLOSEDMINUTES { get; set; }

        public virtual int SPR_TOTALMINUTES { get; set; }

        public virtual int SPR_OBMINUTES { get; set; }

        public virtual int SPR_AMINUTES { get; set; }

        public virtual int SPR_PAMINUTES { get; set; }

        public virtual int SPR_TMINUTES { get; set; }

        public virtual int SPR_TAMMINUTES { get; set; }

        public virtual int SPR_BEKMINUTES { get; set; }

        public virtual int SPR_TEKLIFASAMASIMINUTES { get; set; }

        public virtual string SPR_TEKLIFASAMASI { get; set; }

        public virtual int SPR_EKMMINUTES { get; set; }

        public virtual decimal SPR_FINANSMINUTES { get; set; }

        public virtual decimal SPR_KALITEMINUTES { get; set; }

        public virtual decimal SPR_HAKEDISMINUTES { get; set; }

        public virtual decimal SPR_OPERASYONMINUTES { get; set; }

        public virtual decimal SPR_MUSTERIYONETIMIMINUTES { get; set; }

        public virtual decimal SPR_SATINALMAMINUTES { get; set; }

        public virtual decimal SPR_RAPORLAMAMINUTES { get; set; }

        public virtual int SPR_PSPK2TIME { get; set; }

        public virtual DateTime SPR_PSPKDATE { get; set; }

        public virtual DateTime SPR_PSPCREATED { get; set; }

        public virtual string SPR_PSPK2 { get; set; }

        public virtual string SPR_PSP { get; set; }
    }
}
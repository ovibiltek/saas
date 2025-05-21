namespace Ovi.Task.Data.DAO
{
    public class TMUSEREXT
    {
        public virtual string USR_CODE { get; set; }

        public virtual string USR_DESC { get; set; }

        public virtual string USR_EMAIL { get; set; }

    }

    public class TMINVOICEEXT
    {
        public virtual string INV_CODE { get; set; }
        public virtual string INV_DESC { get; set; }
    }

    public class TMACTIVITYEXT
    {
        public virtual long ACT_LINE { get; set; }

        public virtual string ACT_DESC { get; set; }
    }

    public class TMDEPARTMENTEXT
    {
        public virtual string DEP_CODE { get; set; }

        public virtual string DEP_DESC { get; set; }
    }

    public class CUSTOMEREXT
    {
        public virtual string CUS_CODE { get; set; }

        public virtual string CUS_DESC { get; set; }
    }

    public class SUPPLIEREXT
    {
        public virtual string SUP_CODE { get; set; }

        public virtual string SUP_DESC { get; set; }

        public virtual string SUP_ACTIVE { get; set; }

        public virtual char SUP_CHK01 { get; set; }

    }

    public class TMREGIONEXT
    {
        public virtual string REG_CODE { get; set; }

        public virtual string REG_DESC { get; set; }
    }

    public class TMCATEGORYEXT
    {
        public virtual string CAT_CODE { get; set; }

        public virtual string CAT_DESC { get; set; }
    }

    public class TMSYSCODEEXT
    {
        public virtual string SYC_CODE { get; set; }

        public virtual string SYC_DESCRIPTION { get; set; }
    }

    public class TABCNT
    {
        public virtual string TAB { get; set; }

        public virtual int CNT { get; set; }
    }
}
namespace Ovi.Task.Data.Entity
{
    public class TMKPI
    {
        public virtual string KPI_CODE { get; set; }

        public virtual string KPI_DESC { get; set; }

        public virtual string KPI_DESCF { get; set; }

        public virtual string KPI_SQL { get; set; }

        public virtual string KPI_INFO { get; set; }

        public virtual string KPI_TYPE { get; set; }

        public virtual int? KPI_ORDER { get; set; }

        public virtual int? KPI_MINVALUE { get; set; }

        public virtual int? KPI_MAXVALUE { get; set; }

        public virtual string KPI_THRESHOLD { get; set; }

        public virtual string KPI_ACTIVE { get; set; }

        public virtual string KPI_ISVALIDATED { get; set; }

        public virtual int KPI_RECORDVERSION { get; set; }

        public virtual int KPI_SQLIDENTITY { get; set; }

        public virtual string KPI_GROUP { get; set; }

        public virtual string KPI_GROUPDESC { get; set; }

        public virtual int? KPI_SIZE { get; set; }

        public virtual string KPI_USERINFO { get; set; }
  

    }
}
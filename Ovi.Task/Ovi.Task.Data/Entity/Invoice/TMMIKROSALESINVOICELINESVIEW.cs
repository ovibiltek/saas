namespace Ovi.Task.Data.Entity.Invoice
{
    public class TMMIKROSALESINVOICELINESVIEW
    {
        public virtual int? INV_ROWID { get; set; }
        public virtual int? INV_CODE { get; set; } 
        public virtual int INV_TASK { get; set; } 
        public virtual decimal? INV_TOTAL { get; set; } 
        public virtual string INV_TSKCATEGORY { get; set; } 
        public virtual string INV_TSKDEPARTMENT { get; set; } 
        public virtual string INV_TSKCUSTOMER { get; set; } 
        public virtual string INV_TSKBRANCH { get; set; } 
        public virtual string INV_TSKCATEGORYGROUP { get; set; }
        public virtual string INV_MMIKRO { get; set; }

    }
}
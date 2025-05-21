using System;namespace Ovi.Task.Data.Entity{    public class TMSERVICEREPORTLINES    {        public virtual string SRP_TSKORGANIZATION { get; set; }
        public virtual int SRP_TSKID { get; set; }
        public virtual string SRP_TSKCUSTOMER { get; set; }
        public virtual string SRP_TSKCUSTOMERDESC { get; set; }
        public virtual string SRP_TSKCUSTOMERPM { get; set; }

        public virtual string SRP_TSKCUSTOMERPMCODE { get; set; }
        public virtual string SRP_TSKCUSTOMERGROUP { get; set; }
        public virtual DateTime SRP_TSKCUSTOMERCREATED { get; set; }
        public virtual string SRP_TSKBRANCH { get; set; }
        public virtual string SRP_TSKBRANCHDESC { get; set; }
        public virtual string SRP_TSKTYPE { get; set; }        public virtual string SRP_TSKTASKTYPE { get; set; }        public virtual string SRP_TSKCATEGORY { get; set; }
        public virtual string SRP_TSKCATEGORYDESC { get; set; }
        public virtual string SRP_BRNREGION { get; set; }
        public virtual string SRP_BRNPROVINCE { get; set; }
        public virtual string SRP_ADSDESC { get; set; }
        public virtual string SRP_TSKCREATEDBY { get; set; }
        public virtual DateTime SRP_TSKCREATED { get; set; }
        public virtual DateTime? SRP_TSKCOMPLETED { get; set; }
        public virtual string SRP_TSKCOMPLETEDMY { get; set; }
        public virtual int SRP_TSALINE { get; set; }
        public virtual string SRP_TSADESC { get; set; }
        public virtual DateTime? SRP_TSADATECOMPLETED { get; set; }
        public virtual string SRP_TSADEPARTMENT { get; set; }
        public virtual string SRP_TSATRADE { get; set; }

        public virtual string SRP_TRADEISSUPP { get; set; }// + = ÇO \\ - = MOBIL
        public virtual string SRP_TRDSUPPLIER { get; set; }
        public virtual long? SRP_TSKPSPCODE { get; set; }
        public virtual string SRP_TSKPSPSTATUS { get; set; }
        public virtual string SRP_TSKPSPSTATUSDESC { get; set; }
        public virtual string SRP_OPETIME { get; set; }
        public virtual decimal SRP_LABORCOST { get; set; }
        public virtual decimal SRP_LABORCALC { get; set; }
        public virtual decimal SRP_LABORPSP { get; set; }
        public virtual decimal SRP_SERVCALC { get; set; }
        public virtual decimal SRP_SERVPSP { get; set; }
        public virtual decimal SRP_SERVICECODERECEIVE { get; set; }        public virtual decimal SRP_SERVICECODESALES { get; set; }        public virtual decimal SRP_SERVICECODEPSP { get; set; }        public virtual decimal SRP_EQUIPMENTRECEIVE { get; set; }        public virtual decimal SRP_EQUIPMENTSALES { get; set; }        public virtual decimal SRP_EQUIPMENTPSP { get; set; }
        public virtual decimal SRP_MISCCOSTRECEIVE_PART { get; set; }
        public virtual decimal SRP_MISCCOSTSALES_PART { get; set; }
        public virtual decimal SRP_MISCCOSTPSP_PART { get; set; }
        public virtual decimal SRP_MISCCOSTRECEIVE_SERVICE { get; set; }
        public virtual decimal SRP_MISCCOSTSALES_SERVICE { get; set; }
        public virtual decimal SRP_MISCCOSTPSP_SERVICE { get; set; }
        public virtual decimal SRP_PARTRECEIVE { get; set; }
        public virtual decimal SRP_PARTPSP { get; set; }
        public virtual decimal? SRP_TOTALCOST { get; set; }
        public virtual decimal? SRP_TOTALPSP { get; set; }        public virtual decimal? SRP_INVRETURN{ get; set; }        public override bool Equals(object obj)        {            var other = obj as TMSERVICEREPORTLINES;            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.SRP_TSKID == SRP_TSKID && other.SRP_TSALINE == SRP_TSALINE;        }
        public override int GetHashCode()        {            unchecked            {                return SRP_TSKID.GetHashCode() ^ SRP_TSALINE.GetHashCode();            }        }    }}
using System;

namespace Ovi.Task.Data.Entity
{
    public class TMEQUIPMENTS
    {
        public virtual long EQP_ID { get; set; }

        public virtual string EQP_CODE { get; set; }

        public virtual string EQP_ORG { get; set; }

        public virtual string EQP_ORGDESC { get; set; }

        public virtual string EQP_DESC { get; set; }

        public virtual string EQP_TYPEENTITY { get; set; }

        public virtual string EQP_TYPE { get; set; }

        public virtual string EQP_TYPEDESC { get; set; }

        public virtual int? EQP_TYPELEVEL { get; set; }

        public virtual string EQP_TYPELEVELCODE { get; set; }

        public virtual string EQP_TYPELEVELDESC { get; set; }

        public virtual string EQP_BRAND { get; set; }

        public virtual string EQP_BRANDDESC { get; set; }

        public virtual string EQP_MODEL { get; set; }

        public virtual string EQP_SERIALNO { get; set; }

        public virtual string EQP_ZONE { get; set; }

        public virtual string EQP_ZONEDESC { get; set; }

        public virtual string EQP_DEPARTMENT { get; set; }

        public virtual string EQP_DEPARTMENTDESC { get; set; }

        public virtual DateTime? EQP_INSDATE { get; set; }

        public virtual long? EQP_PARENT { get; set; }

        public virtual string EQP_PARENTCODE { get; set; }

        public virtual string EQP_PARENTDESC { get; set; }

        public virtual string EQP_BRANCH { get; set; }

        public virtual string EQP_BRANCHDESC { get; set; }

        public virtual string EQP_BRNREFERENCE { get; set; }

        public virtual string EQP_CUSTOMER { get; set; }

        public virtual string EQP_CUSTOMERDESC { get; set; }

        public virtual string EQP_SUPPLIER { get; set; }

        public virtual string EQP_LOCATION { get; set; }

        public virtual string EQP_LOCATIONDESC { get; set; }

        public virtual string EQP_DEFMAINTENANCETRADE { get; set; }

        public virtual string EQP_DEFMAINTENANCETRADEDESC { get; set; }

        public virtual string EQP_REGION { get; set; }

        public virtual string EQP_GUARANTEESTATUS { get; set; }

        public virtual int? EQP_MANUFACTURINGYEAR { get; set; }

        public virtual decimal? EQP_PRICE { get; set; }

        public virtual string EQP_IMPORTANCELEVEL { get; set; }

        public virtual string EQP_PERIODICMAINTENANCEREQUIRED { get; set; }

        public virtual int? EQP_CUSTOMERBARCODELENGTH { get; set; }

        public virtual string EQP_REFERENCENO { get; set; }

        public virtual char EQP_ACTIVE { get; set; }

        public virtual DateTime EQP_CREATED { get; set; }

        public virtual string EQP_CREATEDBY { get; set; }

        public virtual DateTime? EQP_UPDATED { get; set; }

        public virtual string EQP_UPDATEDBY { get; set; }

        public virtual int EQP_RECORDVERSION { get; set; }

        public virtual string EQP_RATING { get; set; }

        public virtual string EQP_RATINGDESC { get; set; }

        public virtual string EQP_HEALTH { get; set; }

        public virtual string EQP_HEALTHDESC { get; set; }

    }
}
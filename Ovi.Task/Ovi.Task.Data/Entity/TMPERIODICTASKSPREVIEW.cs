using System;namespace Ovi.Task.Data.Entity
{
    public class TMPERIODICTASKSPREVIEW
    {
        public virtual int PTP_ID { get; set; }

        public virtual string PTP_PTASK { get; set; }

        public virtual string PTP_ORGANIZATION { get; set; }

        public virtual string PTP_DEPARTMENT { get; set; }

        public virtual string PTP_DEPARTMENTDESC { get; set; }

        public virtual string PTP_PROJECT { get; set; }

        public virtual string PTP_LOCATION { get; set; }

        public virtual string PTP_LOCATIONDESC { get; set; }

        public virtual string PTP_EQUIPMENT { get; set; }

        public virtual string PTP_EQUIPMENTCODE { get; set; }

        public virtual string PTP_EQUIPMENTDESC { get; set; }

        public virtual string PTP_TRADE { get; set; }

        public virtual string PTP_TRADEDESC { get; set; }

        public virtual string PTP_SHORTDESC { get; set; }

        public virtual string PTP_CUSTOMER { get; set; }

        public virtual string PTP_BRANCH { get; set; }

        public virtual string PTP_STATUS { get; set; }

        public virtual string PTP_PRIORITY { get; set; }

        public virtual string PTP_TYPE { get; set; }

        public virtual string PTP_TYPEENTITY { get; set; }        public virtual string PTP_TASKTYPE { get; set; }

        public virtual string PTP_CATEGORY { get; set; }

        public virtual int PTP_PROGRESS { get; set; }

        public virtual int? PTP_CHKLISTPROGRESS { get; set; }

        public virtual char? PTP_HIDDEN { get; set; }

        public virtual int? PTP_RATING { get; set; }

        public virtual string PTP_FOLLOWED { get; set; }

        public virtual string PTP_REQUESTEDBY { get; set; }

        public virtual DateTime PTP_REQUESTED { get; set; }

        public virtual DateTime? PTP_DEADLINE { get; set; }

        public virtual DateTime? PTP_COMPLETED { get; set; }

        public virtual int? PTP_PSPCODE { get; set; }

        public virtual string PTP_PRPCODE { get; set; }

        public virtual char PTP_CHK01 { get; set; }

        public virtual char PTP_CHK02 { get; set; }

        public virtual char PTP_CHK03 { get; set; }

        public virtual char PTP_CHK04 { get; set; }

        public virtual char PTP_CHK05 { get; set; }

        public virtual string PTP_HOLDREASON { get; set; }

        public virtual string PTP_CREATEDBY { get; set; }

        public virtual DateTime PTP_CREATED { get; set; }

        public virtual string PTP_UPDATEDBY { get; set; }

        public virtual DateTime? PTP_UPDATED { get; set; }

        public virtual int PTP_RECORDVERSION { get; set; }    }}
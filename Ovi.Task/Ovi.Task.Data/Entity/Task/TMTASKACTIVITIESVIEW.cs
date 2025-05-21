using Ovi.Task.Data.Configuration;
using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKACTIVITIESVIEW : ICloneable
    {
        public virtual long TSK_TSAID { get; set; }

        public virtual long TSK_ID { get; set; }

        public virtual string TSK_ORGANIZATION { get; set; }

        public virtual string TSK_ORGANIZATIONDESC { get; set; }

        public virtual string TSK_DEPARTMENT { get; set; }

        public virtual string TSK_DEPARTMENTDESC { get; set; }

        public virtual string TSK_ACTDEPARTMENT { get; set; }

        public virtual string TSK_CREATEDBYDEPARTMENT { get; set; }

        public virtual int? TSK_PROJECT { get; set; }

        public virtual string TSK_PROJECTDESC { get; set; }

        public virtual string TSK_LOCATION { get; set; }

        public virtual string TSK_LOCATIONDESC { get; set; }

        public virtual string TSK_CATEGORY { get; set; }

        public virtual string TSK_CATEGORYDESC { get; set; }

        public virtual string TSK_TASKTYPE { get; set; }

        public virtual string TSK_TASKTYPEDESC { get; set; }

        public virtual string TSK_SHORTDESC { get; set; }

        public virtual string TSK_STATUS { get; set; }

        public virtual string TSK_STATUSDESC { get; set; }

        public virtual string TSK_STATUSCSS { get; set; }

        public virtual string TSK_PRIORITY { get; set; }

        public virtual string TSK_PRIORITYDESC { get; set; }

        public virtual string TSK_PRIORITYCOLOR { get; set; }

        public virtual string TSK_PRIORITYCSS { get; set; }

        public virtual string TSK_TYPE { get; set; }

        public virtual string TSK_TYPEENTITY { get; set; }

        public virtual string TSK_TYPEDESC { get; set; }

        public virtual long TSK_PROGRESS { get; set; }

        public virtual char TSK_HIDDEN { get; set; }

        public virtual string TSK_FOLLOWED { get; set; }

        [ExcludedWhenExport]
        public virtual string TSK_ASSIGNEDTO { get; set; }

        public virtual int? TSK_TSASERVICECODE { get; set; }

        public virtual string TSK_TSASERVICECODEDESC { get; set; }

        public virtual string TSK_TSASERVICECODEUOM { get; set; }

        public virtual decimal? TSK_TSAQUANTITY { get; set; }

        [ExcludedWhenExport]
        public virtual string TSK_ACTTRADE { get; set; }

        public virtual string TSK_REQUESTEDBY { get; set; }

        public virtual string TSK_REQUESTEDBYDESC { get; set; }

        public virtual DateTime? TSK_REQUESTED { get; set; }

        public virtual int? TSK_RATING { get; set; }

        public virtual DateTime? TSK_DEADLINE { get; set; }

        public virtual DateTime? TSK_COMPLETED { get; set; }

        public virtual DateTime? TSK_CLOSED { get; set; }

        public virtual char TSK_CHK01 { get; set; }

        public virtual char TSK_CHK02 { get; set; }

        public virtual char TSK_CHK03 { get; set; }

        public virtual char TSK_CHK04 { get; set; }

        public virtual char TSK_CHK05 { get; set; }

        public virtual string TSK_CREATEDBY { get; set; }

        public virtual string TSK_CREATEDBYDESC { get; set; }

        public virtual DateTime TSK_CREATED { get; set; }

        public virtual string TSK_UPDATEDBY { get; set; }

        public virtual DateTime? TSK_UPDATED { get; set; }

        public virtual int TSK_RECORDVERSION { get; set; }

        [ExcludedWhenExport]
        public virtual long TSK_CMNTCOUNT { get; set; }

        [ExcludedWhenExport]
        public virtual long TSK_DOCCOUNT { get; set; }

        public virtual string TSK_CUSTOMER { get; set; }

        public virtual string TSK_CUSTOMERDESC { get; set; }

        public virtual string TSK_CUSTOMERPM { get; set; }

        public virtual string TSK_CUSTOMERGROUP { get; set; }

        public virtual string TSK_CUSTOMERGROUPDESC { get; set; }

        public virtual string TSK_BRANCH { get; set; }

        public virtual string TSK_BRANCHDESC { get; set; }

        public virtual string TSK_BRANCHPM { get; set; }

        public virtual string TSK_HOLDREASON { get; set; }

        public virtual string TSK_HOLDREASONDESC { get; set; }

        public virtual DateTime? TSK_HOLDDATE { get; set; }

        public virtual DateTime? TSK_APD { get; set; } // Activity Planning Date

        [ExcludedWhenExport]
        public virtual DateTime? TSK_DATEBOOKED { get; set; }

        public virtual string TSK_PRICINGPARAM { get; set; }

        [ExcludedWhenExport]
        public virtual char TSK_IPP { get; set; } // Included Payment Progress Flag

        public virtual long? TSK_PSPCODE { get; set; }

        public virtual string TSK_PRPCODE { get; set; }

        public virtual string TSK_PTASK { get; set; }

        public virtual string TSK_REFERENCE { get; set; }

        [ExcludedWhenExport]
        public virtual char TSK_CFEKMAL { get; set; }

        public virtual string TSK_REGION { get; set; }

        public virtual int TSK_HOLDCOUNT { get; set; }

        public virtual int TSK_HOLDDURATION { get; set; }

        public virtual string TSK_CANCELLATIONREASON { get; set; }

        public virtual string TSK_CANCELLATIONREASONDESC { get; set; }

        public virtual string TSK_CANCELLATIONDESC { get; set; }

        public virtual int TSK_TSALINE { get; set; }

        public virtual string TSK_TSADESC { get; set; }

        public virtual string TSK_TSATRADE { get; set; }

        public virtual string TSK_TSATRADEDESC { get; set; }

        public virtual string TSK_TSAASSIGNEDTO { get; set; }

        public virtual DateTime? TSK_TSASCHFROM { get; set; }

        public virtual DateTime? TSK_TSASCHTO { get; set; }

        public virtual string TSK_TSAMOBILENOTE { get; set; }

        public virtual char TSK_TSACOMPLETED { get; set; }

        public virtual char TSK_TSACHK01 { get; set; }

        public virtual char TSK_TSACHK02 { get; set; }

        public virtual long? TSK_TSAINVOICE { get; set; }

        public virtual string TSK_INVINVOICE { get; set; }

        public virtual char TSK_QUOTATION { get; set; }

        public virtual string TSK_QUOTATIONSTATUS { get; set; }

        public virtual char TSK_SUPERVISION { get; set; }

        public virtual char TSK_PURCHASEORDER { get; set; }

        public virtual char TSK_PURCHASEORDERREQ { get; set; }

        public virtual int? TSK_CONTRACT { get; set; }

        public virtual int TSK_ACTIVITYCOUNT { get; set; }

        public virtual string TSK_NOTE { get; set; }


        public virtual object Clone()
        {
            return MemberwiseClone();
        }
    }
}
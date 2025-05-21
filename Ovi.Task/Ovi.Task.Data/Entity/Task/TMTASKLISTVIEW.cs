using Ovi.Task.Data.Configuration;
using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKLISTVIEW : ICloneable
    {
        public virtual long TSK_ID { get; set; }

        public virtual string TSK_ORGANIZATION { get; set; }

        public virtual string TSK_ORGCURRENCY { get; set; }

        public virtual string TSK_ORGANIZATIONDESC { get; set; }

        public virtual string TSK_DEPARTMENT { get; set; }

        public virtual string TSK_DEPARTMENTDESC { get; set; }

        public virtual string TSK_ACTDEPARTMENT { get; set; }

        public virtual string TSK_CREATEDBYDEPARTMENT { get; set; }

        public virtual int? TSK_PROJECT { get; set; }

        public virtual string TSK_PROJECTDESC { get; set; }

        public virtual string TSK_LOCATION { get; set; }

        public virtual string TSK_LOCATIONDESC { get; set; }

        public virtual string TSK_LOCATIONBARCODE { get; set; }

        public virtual string TSK_LOCLATITUDE { get; set; }

        public virtual string TSK_LOCLONGITUDE { get; set; }

        public virtual string TSK_PROVINCE { get; set; }

        public virtual int? TSK_EQUIPMENT { get; set; }

        public virtual string TSK_EQUIPMENTCODE { get; set; }

        public virtual string TSK_EQUIPMENTDESC { get; set; }

        public virtual string TSK_EQUIPMENTTYPE { get; set; }

        public virtual string TSK_EQUIPMENTTYPEDESC { get; set; }

        public virtual char TSK_EQUIPMENTREQUIRED { get; set; }

        public virtual string TSK_CATEGORY { get; set; }

        public virtual string TSK_CATEGORYDESC { get; set; }

        public virtual string TSK_TASKTYPE { get; set; }

        public virtual string TSK_TASKTYPEDESC { get; set; }

        public virtual string TSK_SHORTDESC { get; set; }

        public virtual string TSK_STATUS { get; set; }

        public virtual string TSK_STATUSDESC { get; set; }

        public virtual string TSK_STATUSCSS { get; set; }

        public virtual string TSK_STATUSP { get; set; }

        public virtual string TSK_PRIORITY { get; set; }

        public virtual string TSK_PRIORITYDESC { get; set; }

        public virtual string TSK_PRIORITYCOLOR { get; set; }

        public virtual string TSK_PRIORITYCSS { get; set; }

        public virtual string TSK_TYPE { get; set; }

        public virtual string TSK_TYPEENTITY { get; set; }

        public virtual string TSK_TYPEDESC { get; set; }

        public virtual long TSK_PROGRESS { get; set; }

        public virtual int? TSK_CHKLISTPROGRESS { get; set; }

        public virtual char TSK_HIDDEN { get; set; }

        public virtual string TSK_FOLLOWED { get; set; }

        public virtual string TSK_ASSIGNEDTO { get; set; }

        public virtual string TSK_ACTTRADE { get; set; }

        public virtual string TSK_REQUESTEDBY { get; set; }

        public virtual string TSK_REQUESTEDBYDESC { get; set; }

        public virtual DateTime? TSK_REQUESTED { get; set; }

        public virtual int? TSK_RATING { get; set; }

        public virtual string TSK_RATINGCOMMENTS { get; set; }

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

        public virtual string TSK_CUSTOMERGROUP { get; set; }

        public virtual string TSK_CUSTOMERGROUPDESC { get; set; }

        public virtual string TSK_CUSTOMERPM { get; set; }

        public virtual string TSK_CUSTOMERNOTES { get; set; }

        public virtual string TSK_BRANCH { get; set; }

        public virtual string TSK_BRANCHDESC { get; set; }

        public virtual string TSK_BRANCHPM { get; set; }

        public virtual string TSK_BRANCHNOTES { get; set; }

        public virtual string TSK_BRANCHADDRESS { get; set; }

        public virtual string TSK_BRANCHREFERENCE { get; set; }

        public virtual string TSK_HOLDREASON { get; set; }

        public virtual string TSK_HOLDREASONDESC { get; set; }

        public virtual DateTime? TSK_HOLDDATE { get; set; }

        public virtual int? TSK_LASTHOLDDURATION { get; set; }

        public virtual DateTime? TSK_APD { get; set; } // Activity Planning Date

        [ExcludedWhenExport]
        public virtual DateTime? TSK_DATEBOOKED { get; set; }

        public virtual string TSK_PRICINGPARAM { get; set; }

        public virtual char TSK_IPP { get; set; } // Included Payment Progress Flag

        public virtual long? TSK_PSPCODE { get; set; }

        public virtual string TSK_PRPCODE { get; set; }

        public virtual string TSK_PTASK { get; set; }

        public virtual string TSK_REFERENCE { get; set; }

        [ExcludedWhenExport]
        public virtual char TSK_CFEKMAL { get; set; }

        public virtual string TSK_REGION { get; set; }

        public virtual int TSK_HOLDCOUNT { get; set; }

        public virtual int? TSK_HOLDDURATION { get; set; }

        public virtual string TSK_CANCELLATIONREASON { get; set; }

        public virtual string TSK_CANCELLATIONREASONDESC { get; set; }

        public virtual string TSK_CANCELLATIONDESC { get; set; }

        public virtual char TSK_QUOTATION { get; set; }

        public virtual char TSK_SUPERVISION { get; set; }

        public virtual char TSK_PURCHASEORDER { get; set; }

        public virtual char TSK_PURCHASEORDERREQ { get; set; }

        public virtual string TSK_QUOTATIONSTATUS { get; set; }

        public virtual string TSK_QUOTATIONSTATUSDESC { get; set; }

        public virtual string TSK_NOTE { get; set; }

        public virtual int? TSK_CONTRACT { get; set; }

        public virtual string TSK_PSPSTATUS { get; set; }

        public virtual string TSK_PSPSTATUSDESC { get; set; }

        public virtual int? TSK_CONTRACTID { get; set; }

        public virtual string TSK_CONTRACTDESC { get; set; }


        public virtual object Clone()
        {
            return MemberwiseClone();
        }
    }
}
using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPERIODICTASKSPREVIEW_MAP : ClassMap<TMPERIODICTASKSPREVIEW>
    {
        public TMPERIODICTASKSPREVIEW_MAP()
        {
            Id(x => x.PTP_ID);
            Map(x => x.PTP_PTASK);
            Map(x => x.PTP_ORGANIZATION);
            Map(x => x.PTP_DEPARTMENT);
            Map(x => x.PTP_DEPARTMENTDESC).Length(PropertySettings.L250)
                .ReadOnly().Formula("dbo.GetDesc('TMDEPARTMENTS','DEP_DESC',PTP_DEPARTMENT, (SELECT d.DEP_DESC FROM TMDEPARTMENTS d WHERE d.DEP_CODE = PTP_DEPARTMENT),:SessionContext.Language)");
            Map(x => x.PTP_PROJECT);
            Map(x => x.PTP_LOCATION);
            Map(x => x.PTP_LOCATIONDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT l.LOC_DESC FROM TMLOCATIONS l WHERE l.LOC_CODE = PTP_LOCATION)");
            Map(x => x.PTP_EQUIPMENT);
            Map(x => x.PTP_EQUIPMENTCODE).ReadOnly().Formula("(SELECT e.EQP_CODE FROM TMEQUIPMENTS e WHERE e.EQP_ID = PTP_EQUIPMENT)");
            Map(x => x.PTP_EQUIPMENTDESC).ReadOnly().Formula("(SELECT e.EQP_DESC FROM TMEQUIPMENTS e WHERE e.EQP_ID = PTP_EQUIPMENT)");
            Map(x => x.PTP_TRADE);
            Map(x => x.PTP_TRADEDESC).ReadOnly().Formula("(SELECT t.TRD_DESC FROM TMTRADES t WHERE t.TRD_CODE = PTP_TRADE)");
            Map(x => x.PTP_SHORTDESC);
            Map(x => x.PTP_CUSTOMER);
            Map(x => x.PTP_BRANCH);
            Map(x => x.PTP_STATUS);
            Map(x => x.PTP_PRIORITY);
            Map(x => x.PTP_TYPE);
            Map(x => x.PTP_TYPEENTITY);
            Map(x => x.PTP_TASKTYPE);
            Map(x => x.PTP_CATEGORY);
            Map(x => x.PTP_PROGRESS);
            Map(x => x.PTP_CHKLISTPROGRESS);
            Map(x => x.PTP_HIDDEN);
            Map(x => x.PTP_RATING);
            Map(x => x.PTP_FOLLOWED);
            Map(x => x.PTP_REQUESTEDBY);
            Map(x => x.PTP_REQUESTED);
            Map(x => x.PTP_DEADLINE);
            Map(x => x.PTP_COMPLETED);
            Map(x => x.PTP_PSPCODE);
            Map(x => x.PTP_PRPCODE);
            Map(x => x.PTP_CHK01);
            Map(x => x.PTP_CHK02);
            Map(x => x.PTP_CHK03);
            Map(x => x.PTP_CHK04);
            Map(x => x.PTP_CHK05);
            Map(x => x.PTP_HOLDREASON);
            Map(x => x.PTP_CREATEDBY);
            Map(x => x.PTP_CREATED);
            Map(x => x.PTP_UPDATEDBY);
            Map(x => x.PTP_UPDATED);
            Map(x => x.PTP_RECORDVERSION).Default("0");
        }
    }
}
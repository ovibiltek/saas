using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPERIODICTASKPARAMETERS_MAP : ClassMap<TMPERIODICTASKPARAMETERS>
    {
        public TMPERIODICTASKPARAMETERS_MAP()
        {
            Id(x => x.PTP_ID);
            Map(x => x.PTP_PTASK).Length(PropertySettings.L50);
            Map(x => x.PTP_LOCATION).Length(PropertySettings.L50);
            Map(x => x.PTP_LOCATIONDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT l.LOC_DESC FROM TMLOCATIONS l WHERE l.LOC_CODE = PTP_LOCATION)");
            Map(x => x.PTP_EQUIPMENT);
            Map(x => x.PTP_EQUIPMENTCODE).ReadOnly().Formula("(SELECT e.EQP_CODE FROM TMEQUIPMENTS e WHERE e.EQP_ID = PTP_EQUIPMENT)");
            Map(x => x.PTP_EQUIPMENTDESC).ReadOnly().Formula("(SELECT e.EQP_DESC FROM TMEQUIPMENTS e WHERE e.EQP_ID = PTP_EQUIPMENT)");
            Map(x => x.PTP_DEPARTMENT).Length(PropertySettings.L50);
            Map(x => x.PTP_DEPARTMENTDESC).Length(PropertySettings.L250)
                .ReadOnly().Formula("dbo.GetDesc('TMDEPARTMENTS','DEP_DESC',PTP_DEPARTMENT, (SELECT d.DEP_DESC FROM TMDEPARTMENTS d WHERE d.DEP_CODE = PTP_DEPARTMENT),:SessionContext.Language)");
            Map(x => x.PTP_BRANCH).Length(PropertySettings.L50);
            Map(x => x.PTP_BRANCHDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = PTP_BRANCH)");
            Map(x => x.PTP_PLANDATE);
            Map(x => x.PTP_RESPONSIBLE).Length(PropertySettings.L50);
            Map(x => x.PTP_RESPONSIBLEDESC).Length(PropertySettings.L250).ReadOnly().Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = PTP_RESPONSIBLE)");
            Map(x => x.PTP_TRADE);
            Map(x => x.PTP_TRADEDESC).ReadOnly().Formula("(SELECT t.TRD_DESC FROM TMTRADES t WHERE t.TRD_CODE = PTP_TRADE)");
            Map(x => x.PTP_ACTIVE);
            Map(x => x.PTP_CREATED);
            Map(x => x.PTP_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.PTP_UPDATED);
            Map(x => x.PTP_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.PTP_RECORDVERSION).Default("0");
            Map(x => x.PTP_WORKPERMIT);
            Map(x => x.PTP_REPORTING);

        }
    }
}
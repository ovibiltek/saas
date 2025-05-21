using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Maps
{
    public sealed class TMEQUIPMENTWARRANTY_MAP : ClassMap<TMEQUIPMENTWARRANTY>
    {
        public TMEQUIPMENTWARRANTY_MAP()
        {
            Id(x => x.EWR_ID);
            Map(x => x.EWR_EQUIPMENT);
            Map(x => x.EWR_TYPE);
            Map(x => x.EWR_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMEQUIPMENTWARRANTY','EWR_TYPE', EWR_TYPE, EWR_TYPE,:SessionContext.Language)");
            Map(x => x.EWR_DURATIONTYPE);
            Map(x => x.EWR_DURATIONTYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMEQUIPMENTWARRANTY','EWR_DURATIONTYPE', EWR_DURATIONTYPE, EWR_DURATIONTYPE,:SessionContext.Language)");
            Map(x => x.EWR_DATESTART);
            Map(x => x.EWR_DATEEND);
            Map(x => x.EWR_WARNING);
            Map(x => x.EWR_UOM);
            Map(x => x.EWR_INITIALUSE);
            Map(x => x.EWR_ENDUSE);
            Map(x => x.EWR_CHKLABOR);
            Map(x => x.EWR_LABORLIMIT);
            Map(x => x.EWR_LABORCURR);
            Map(x => x.EWR_CHKPART);
            Map(x => x.EWR_PARTLIMIT);
            Map(x => x.EWR_PARTCURR);
            Map(x => x.EWR_CREATED);
            Map(x => x.EWR_CREATEDBY);
            Map(x => x.EWR_UPDATED);
            Map(x => x.EWR_UPDATEDBY);
            Map(x => x.EWR_RECORDVERSION);
        }
    }
}
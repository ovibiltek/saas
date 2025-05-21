using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping {
    public sealed class TMSUPPLIERTASKTYPESVIEW_MAP : ClassMap<TMSUPPLIERTASKTYPESVIEW> {
        public TMSUPPLIERTASKTYPESVIEW_MAP()
        {
            Id(x => x.STT_SUPCODE);
            Map(x => x.STT_SUPDESC);
            Map(x => x.STT_SUPTITLE);
            Map(x => x.STT_SUPORGANIZATION);
            Map(x => x.STT_SUPTYPE);
            Map(x => x.STT_SUPREGION);
            Map(x => x.STT_SUPPHONE);
            Map(x => x.STT_SUPPHONE2);
            Map(x => x.STT_SUPFAX);
            Map(x => x.STT_SUPEMAIL);
            Map(x => x.STT_SUPAUTHORIZEDPERSON);
            Map(x => x.STT_SUPOWNER);
            Map(x => x.STT_SUPACCOUNTCODE);
            Map(x => x.STT_SUPPAYMENTPERIOD);
            Map(x => x.STT_SUPTAXOFFICE);
            Map(x => x.STT_SUPTAXNO);
            Map(x => x.STT_SUPCONTRACTSTART);
            Map(x => x.STT_SUPCONTRACTEND);
            Map(x => x.STT_SUPCONTRACTRENEWALPERIOD);
            Map(x => x.STT_SUPACTIVE);
            Map(x => x.STT_SUPCREATEDBY);
            Map(x => x.STT_SUPCREATED);
            Map(x => x.STT_SUPUPDATEDBY);
            Map(x => x.STT_SUPUPDATED);
            Map(x => x.STT_IL);
            Map(x => x.STT_ILCE);
            Map(x => x.STT_ELEKTRIK);
            Map(x => x.STT_BACKUP);
            Map(x => x.STT_INSAIISLER);
            Map(x => x.STT_JENERATOR);
            Map(x => x.STT_KEPENK);
            Map(x => x.STT_MEKANIK);
            Map(x => x.STT_MOBDEK);
            Map(x => x.STT_NAKLOJ);
            Map(x => x.STT_SIHTES);
            Map(x => x.STT_TEKDEN);
            Map(x => x.STT_UPS);
            Map(x => x.STT_YANSIS);
            Map(x => x.STT_YGISOR);
            Map(x => x.STT_YURMERASAN);
            Map(x => x.STT_ZAYAK);

        }
    }
}

using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCOMPENSATIONVIEW_MAP : ClassMap<TMCOMPENSATIONVIEW>
    {
        public TMCOMPENSATIONVIEW_MAP()
        {
            Id(x => x.REA_ID);
            Map(x => x.REA_ORDER);
            Map(x => x.REA_PERIOD);
            Map(x => x.REA_STATUS);
            Map(x => x.REA_ROWNM);
            Map(x => x.REA_TASK);
            Map(x => x.REA_REGCODE);
            Map(x => x.REA_CUSCODE);
            Map(x => x.REA_CUSDESC);
            Map(x => x.REA_BRNCODE);
            Map(x => x.REA_BRNDESC);
            Map(x => x.REA_LOCCODE);
            Map(x => x.REA_LOCDESC);
            Map(x => x.REA_DATE);
            Map(x => x.REA_ACTIVE);
            Map(x => x.REA_INDUCTIVE);
            Map(x => x.REA_CAPACITIVE);
            Map(x => x.REA_R1);
            Map(x => x.REA_R2);
            Map(x => x.REA_R1C);
            Map(x => x.REA_R2C);
            Map(x => x.REA_PV);
            Map(x => x.REA_RCONST);
        }
    }
}
using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMETERREADINGS_MAP : ClassMap<TMMETERREADINGS>
    {
        public TMMETERREADINGS_MAP()
        {
            Id(x => x.REA_ID);
            Map(x => x.REA_TASK);
            Map(x => x.REA_ACTIVITY);
            Map(x => x.REA_ACTIVITYDESC).ReadOnly().Formula("(SELECT ta.TSA_DESC FROM TMTASKACTIVITIES ta WHERE ta.TSA_LINE = REA_ACTIVITY AND ta.TSA_TASK = REA_TASK)");
            Map(x => x.REA_DATE);
            Map(x => x.REA_ACTIVE);
            Map(x => x.REA_INDUCTIVE);
            Map(x => x.REA_CAPACITIVE);
            Map(x => x.REA_R1);
            Map(x => x.REA_R2);
            Map(x => x.REA_R1C);
            Map(x => x.REA_R2C);
            Map(x => x.REA_CREATED);
            Map(x => x.REA_CREATEDBY);
            Map(x => x.REA_UPDATED);
            Map(x => x.REA_UPDATEDBY);
            Map(x => x.REA_RECORDVERSION).Default("0");
        }
    }
}
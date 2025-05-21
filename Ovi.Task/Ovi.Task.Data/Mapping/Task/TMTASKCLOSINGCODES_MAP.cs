using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKCLOSINGCODES_MAP : ClassMap<TMTASKCLOSINGCODES>
    {
        public TMTASKCLOSINGCODES_MAP()
        {
            Id(x => x.CLC_TASK).GeneratedBy.Assigned();
            Map(x => x.CLC_FAILURE);
            Map(x => x.CLC_FAILURECODEDESC).Formula("dbo.GetDesc('TMFAILURES','FAL_DESC', CLC_FAILURE, (SELECT f.FAL_DESC FROM TMFAILURES f WHERE f.FAL_CODE =  CLC_FAILURE) ,:SessionContext.Language)");
            Map(x => x.CLC_FAILUREDESC);
            Map(x => x.CLC_CAUSE);
            Map(x => x.CLC_CAUSECODEDESC).Formula("dbo.GetDesc('TMCAUSES','CAU_DESC', CLC_CAUSE, (SELECT c.CAU_DESC FROM TMCAUSES c WHERE c.CAU_CODE =  CLC_CAUSE),:SessionContext.Language)");
            Map(x => x.CLC_CAUSEDESC);
            Map(x => x.CLC_ACTION);
            Map(x => x.CLC_ACTIONCODEDESC).Formula("dbo.GetDesc('TMACTIONS','ACT_DESC', CLC_ACTION, (SELECT a.ACT_DESC FROM TMACTIONS a WHERE a.ACT_CODE =  CLC_ACTION),:SessionContext.Language)");
            Map(x => x.CLC_ACTIONDESC);
            Map(x => x.CLC_CREATEDBY);
            Map(x => x.CLC_CREATED);
            Map(x => x.CLC_UPDATEDBY);
            Map(x => x.CLC_UPDATED);
            Map(x => x.CLC_RECORDVERSION).Default("0");
        }
    }
}
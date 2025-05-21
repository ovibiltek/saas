using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMEXCHRATES_MAP : ClassMap<TMEXCHRATES>
    {
        public TMEXCHRATES_MAP()
        {
            Id(x => x.CRR_ID);
            Map(x => x.CRR_CURR).Length(PropertySettings.L50);
            Map(x => x.CRR_CURRDESC).Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', CRR_CURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = CRR_CURR), :SessionContext.Language)");
            Map(x => x.CRR_BASECURR).Length(PropertySettings.L50);
            Map(x => x.CRR_BASECURRDESC).Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', CRR_BASECURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = CRR_BASECURR), :SessionContext.Language)");
            Map(x => x.CRR_EXCH);
            Map(x => x.CRR_STARTDATE);
            Map(x => x.CRR_ENDDATE);
            Map(x => x.CRR_CREATED);
            Map(x => x.CRR_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.CRR_UPDATED);
            Map(x => x.CRR_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.CRR_RECORDVERSION).Default("0");
        }
    }
}
using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTASKSTATUSDURATIONS_MAP : ClassMap<TMTASKSTATUSDURATIONS>
    {
        public TMTASKSTATUSDURATIONS_MAP()
        {
            Id(x => x.SPR_TSK);
            Map(x => x.SPR_TSKDESC);
            Map(x => x.SPR_TSKORG);
            Map(x => x.SPR_ORGDESC);
            Map(x => x.SPR_CAT);
            Map(x => x.SPR_CATDESC);
            Map(x => x.SPR_TSKTASKTYPE);
            Map(x => x.SPR_TSKTASKTYPEDESC);
            Map(x => x.SPR_CUSTOMER);
            Map(x => x.SPR_BRANCH);
            Map(x => x.SPR_BRANCHDESC);
            Map(x => x.SPR_TSKREQUESTED);
            Map(x => x.SPR_STATUS);
            Map(x => x.SPR_HOLDDEPARTMENT);
            Map(x => x.SPR_HOLDREASON);
            Map(x => x.SPR_TSKCREATED);
            Map(x => x.SPR_STATUSDESC);
            Map(x => x.SPR_OB);
            Map(x => x.SPR_A);
            Map(x => x.SPR_PA);
            Map(x => x.SPR_T);
            Map(x => x.SPR_TAM);
            Map(x => x.SPR_BEK);
            Map(x => x.SPR_FINANS);
            Map(x => x.SPR_KALITE);
            Map(x => x.SPR_HAKEDIS);
            Map(x => x.SPR_OPERASYON);
            Map(x => x.SPR_TOTAL);
            Map(x => x.SPR_TOTALCLOSED);
            Map(x => x.SPR_TOTALCLOSEDMINUTES);
            Map(x => x.SPR_TOTALMINUTES);
            Map(x => x.SPR_EKM);
            Map(x => x.SPR_EKMMINUTES);
            Map(x => x.SPR_MUSTERIYONETIMI);
            Map(x => x.SPR_SATINALMA);
            Map(x => x.SPR_RAPORLAMA);
            Map(x => x.SPR_OBMINUTES);
            Map(x => x.SPR_AMINUTES);
            Map(x => x.SPR_PAMINUTES);
            Map(x => x.SPR_TEKLIFASAMASI);
            Map(x => x.SPR_TEKLIFASAMASIMINUTES);
            Map(x => x.SPR_TMINUTES);
            Map(x => x.SPR_TAMMINUTES);
            Map(x => x.SPR_BEKMINUTES);
            Map(x => x.SPR_FINANSMINUTES);
            Map(x => x.SPR_KALITEMINUTES);
            Map(x => x.SPR_HAKEDISMINUTES);
            Map(x => x.SPR_OPERASYONMINUTES);
            Map(x => x.SPR_MUSTERIYONETIMIMINUTES);
            Map(x => x.SPR_SATINALMAMINUTES);
            Map(x => x.SPR_RAPORLAMAMINUTES);
            Map(x => x.SPR_PSPK2TIME);
            Map(x => x.SPR_PSPKDATE);
            Map(x => x.SPR_PSPCREATED);
            Map(x => x.SPR_PSPK2);
            Map(x => x.SPR_PSP);
        }
    }
}


using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSUPPLIEREQUIPMANPRICES_MAP : ClassMap<TMSUPPLIEREQUIPMANPRICES>
    {
        public TMSUPPLIEREQUIPMANPRICES_MAP()
        {
            Id(x => x.SMP_ID);
            Map(x => x.SMP_SUPCODE);
            Map(x => x.SMP_PTKCODE);
            Map(x => x.SMP_PTKDESC).ReadOnly().Formula("dbo.GetDesc('TMPERIODICTASKS','PTK_DESC', SMP_PTKCODE, (SELECT p.PTK_DESC FROM TMPERIODICTASKS p WHERE p.PTK_CODE = SMP_PTKCODE), :SessionContext.Language)");
            Map(x => x.SMP_EQUIPMENTTYPEENTITY);
            Map(x => x.SMP_EQUIPMENTTYPE);
            Map(x => x.SMP_EQUIPMENTTYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', SMP_EQUIPMENTTYPEENTITY + '#' + SMP_EQUIPMENTTYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = SMP_EQUIPMENTTYPE AND t.TYP_ENTITY = SMP_EQUIPMENTTYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.SMP_STARTDATE);
            Map(x => x.SMP_ENDDATE);
            Map(x => x.SMP_UNITPRICE);
            Map(x => x.SMP_CURRENCY);
            Map(x => x.SMP_CURRENCYDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', SMP_CURRENCY, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = SMP_CURRENCY), :SessionContext.Language)");
            Map(x => x.SMP_CREATED);
            Map(x => x.SMP_CREATEDBY);
            Map(x => x.SMP_UPDATED);
            Map(x => x.SMP_UPDATEDBY);
            Map(x => x.SMP_RECORDVERSION);
        }
    }
}
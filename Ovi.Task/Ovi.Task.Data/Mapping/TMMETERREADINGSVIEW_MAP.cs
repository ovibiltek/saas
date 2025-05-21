using FluentNHibernate.Mapping;using Ovi.Task.Data.Entity;namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMETERREADINGSVIEW_MAP : ClassMap<TMMETERREADINGSVIEW>
    {
        public TMMETERREADINGSVIEW_MAP()        {            Id(x => x.REA_ID);
            Map(x => x.REA_TSKID);
            Map(x => x.REA_TSKSHORTDESC);
            Map(x => x.REA_TSKCUSTOMER);
            Map(x => x.REA_TSKCUSTOMERDESC);
            Map(x => x.REA_TSKBRANCH);
            Map(x => x.REA_TSKBRANCHDESC);
            Map(x => x.REA_ACTIVITY);
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
        }
    }}
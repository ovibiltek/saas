using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMDOCSMETA_MAP : ClassMap<TMDOCSMETA>
    {
        public TMDOCSMETA_MAP()
        {
            Id(x => x.DOC_ID);
            Map(x => x.DOC_CONTENTTYPE).Length(PropertySettings.L250);
            Map(x => x.DOC_GUID).Length(PropertySettings.L250);
            Map(x => x.DOC_OFN).Length(PropertySettings.L250);
            Map(x => x.DOC_TYPE).Length(PropertySettings.L50);
            Map(x => x.DOC_TYPEDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('DOCTYPE',DOC_TYPE,:SessionContext.Language)");                
            Map(x => x.DOC_PATH).ReadOnly().Formula("dbo.GetDocFullPath(DOC_CREATED,DOC_SUBJECT,DOC_SOURCE,DOC_OFN,DOC_LINK)");
            Map(x => x.DOC_SIZE);
            Map(x => x.DOC_SOURCE).Length(PropertySettings.L50);
            Map(x => x.DOC_SUBJECT).Length(PropertySettings.L50);
            Map(x => x.DOC_LINK);
            Map(x => x.DOC_CREATED);
            Map(x => x.DOC_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.DOC_CREATEDBYDESC).Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = DOC_CREATEDBY)");
            Map(x => x.DOC_RECORDVERSION).Default("0");
            Map(x => x.DOC_CHECK).ReadOnly().Formula("(SELECT c.CHK_VALUE FROM TMDOCCHECK c WHERE c.CHK_DOCID = DOC_ID)");
        }
    }
}
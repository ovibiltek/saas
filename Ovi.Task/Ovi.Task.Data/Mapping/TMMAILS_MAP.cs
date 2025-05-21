using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMAILS_MAP : ClassMap<TMMAILS>
    {
        public TMMAILS_MAP()
        {
            Id(x => x.MA_ID);
            Map(x => x.MA_SUBJECT);
            Map(x => x.MA_TOMAIL);
            Map(x => x.MA_SENDER).ReadOnly().Formula("(SELECT mtrx.MAT_SENDER FROM TMMAILTRX mtrx WHERE mtrx.MAT_MAIL = MA_ID)");
            Map(x => x.MA_CC);
            Map(x => x.MA_BCC);
            Map(x => x.MA_REPLYTO);
            Map(x => x.MA_ATTACHMENTS);
            Map(x => x.MA_CREATED);
            Map(x => x.MA_ERROR).ReadOnly().Formula("(SELECT mtrx.MAT_ERROR FROM TMMAILTRX mtrx WHERE mtrx.MAT_MAIL = MA_ID)");
            Map(x => x.MA_TEMPLATEID);
            Map(x => x.MA_READ);
            Map(x => x.MA_USER);
            Map(x => x.MA_TABLENAME);
            Map(x => x.MA_PAGE);
            Map(x => x.MA_TABLEKEY);
            Map(x => x.MA_ENTITY);
            Map(x => x.MA_DOCS);
            Map(x => x.MA_GUID);
            Map(x => x.MA_UPDATED).ReadOnly().Formula("(SELECT mtrx.MAT_SENT FROM TMMAILTRX mtrx WHERE mtrx.MAT_MAIL = MA_ID)");
        }
    }
}
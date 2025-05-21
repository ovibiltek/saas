using Ovi.Task.Data.Entity;
using System.Collections.Generic;

namespace Ovi.Task.Data.Helper
{
    public class MailBuilder
    {
        public static TMMAILTEMPLATES Build(TMMAILS mail, IList<TMMAILPARAMS> parameters, TMMAILTEMPLATES template)
        {
            foreach (var param in parameters)
            {
                var search = string.Format("[{0}]", param.PR_NAME);
                template.TMP_HTML = template.TMP_HTML.Replace(search, param.PR_VALUE);
            }
            return template;
        }
    }
}
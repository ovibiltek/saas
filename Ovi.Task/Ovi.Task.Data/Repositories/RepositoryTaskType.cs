using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Repositories
{

    public class TaskType : BaseRepository<TMSUPPLIERS, string>
    {
        public IList<TMTASKTYPE> GetRegions(string tasktype)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMTASKTYPE>();
                IQuery query = session.CreateSQLQuery(string.Format("SELECT * FROM [dbo].[FNC_GETREGIONS]('{0}')", tasktype));
                return query.SetResultTransformer(Transformers.AliasToBean(typeof(TMTASKTYPE))).List<TMTASKTYPE>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }

}
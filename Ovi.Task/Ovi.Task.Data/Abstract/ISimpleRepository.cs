using System.Collections.Generic;
using Ovi.Task.Data.DAO;

namespace Ovi.Task.Data.Abstract
{
    public interface ISimpleRepository<T1, T2>
    {
        IList<T1> List(GridRequest krg);
        T1 Get(T2 id);
        T1 SaveOrUpdate(T1 p, bool isInsert);
        T1 SaveOrUpdate(T1 p);
        bool DeleteById(T2 p);
    }
}

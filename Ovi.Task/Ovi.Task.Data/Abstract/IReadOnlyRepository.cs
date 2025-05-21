using Ovi.Task.Data.DAO;
using System.Collections.Generic;

namespace Ovi.Task.Data.Abstract
{
    public interface IReadOnlyRepository<T1, T2>
    {
        IList<T1> List(GridRequest krg);

        T1 Get(T2 id);
    }
}
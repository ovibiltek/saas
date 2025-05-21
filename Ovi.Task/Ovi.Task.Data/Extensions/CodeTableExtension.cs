using System.Data;
using NHibernate;
using Ovi.Task.Data.Configuration;

namespace Ovi.Task.Data.Extensions
{
    public static class CodeTableExtension
    {
        private static readonly CodeTable structured = new CodeTable();

        public static IQuery SetStructured(this IQuery query, string name, DataTable dt)
        {
            return query.SetParameter(name, dt, structured);
        }
    }
}
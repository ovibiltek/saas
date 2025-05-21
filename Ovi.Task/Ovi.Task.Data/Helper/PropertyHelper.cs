using Ovi.Task.Data.Configuration;
using System.Collections.Generic;
using System.Linq;

namespace Ovi.Task.Data.Helper
{
    public static class PropertyHelper<T> where T : class
    {
        public static IEnumerable<string> ListExcludedWhenExport()
        {
            var properties = typeof(T).GetProperties()
                .Where(prop => !prop.IsDefined(typeof(ExcludedWhenExport), false))
                .Select(p => p.Name);
            return properties;
        }

        public static IEnumerable<string> ListAll()
        {
            var properties = typeof(T).GetProperties()
                .Where(prop => prop.IsDefined(typeof(ExcludedWhenExport), false))
                .Select(p => p.Name);
            return properties;
        }
    }
}
using System.Linq;
using System.Reflection;

namespace Ovi.Task.Helper.Functional
{
    public class PropertyItem
    {
        public string Source { get; set; }

        public object From { get; set; }

        public object To { get; set; }
    }

    public class PropertyHelper
    {
        public static string[] List<T>()
        {
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            return properties.Select(x => x.Name).ToArray();
        }
    }
}
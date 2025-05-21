using System;
using System.Reflection;

namespace Ovi.Task.Data.Helper
{
    public class TypeHelper
    {
        public static Type GetType(PropertyInfo p)
        {
            return Nullable.GetUnderlyingType(p.PropertyType) ?? p.PropertyType;
        }
    }
}
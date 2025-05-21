using System;

namespace Ovi.Task.Data.Configuration
{
    [AttributeUsage(AttributeTargets.Property, Inherited = false)]
    public class ExcludedWhenExport : Attribute
    {
    }
}
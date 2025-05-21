using System;

namespace Ovi.Task.UI.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public sealed class AllowAnonymousAttribute : Attribute
    {
    }
}
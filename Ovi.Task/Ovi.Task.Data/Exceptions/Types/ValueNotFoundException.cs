using System;

namespace Ovi.Task.Data.Exceptions.Types
{
    public class ValueNotFoundException : Exception
    {
        public ValueNotFoundException(string message) : base(message)
        {
        }
    }
}
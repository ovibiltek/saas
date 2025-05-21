using System;

namespace Ovi.Task.Data.Exceptions.Types
{
    public class UniqueConstraintException : Exception
    {
        public UniqueConstraintException(string message) : base(message)
        {
        }
    }
}
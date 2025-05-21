using System;

namespace Ovi.Task.Data.Exceptions.Types
{
    public class ForeignKeyException : Exception
    {
        public ForeignKeyException(string message) : base(message)
        {
        }
    }
}
using Ovi.Task.Data.Exceptions.Types;
using System;
using System.Data.SqlClient;

namespace Ovi.Task.Data.Exceptions
{
    public class ExceptionParser
    {
        public static Exception Parse(Exception exc)
        {

            if (exc is SqlException && exc.InnerException == null)
            {
                var excsql = (SqlException)exc;
                return excsql.Class == 16 ? new TmsException(excsql.Message, exc) : exc;
            }

            if (exc.InnerException == null)
            {
                return exc;
            }

            if (exc.InnerException.Message.Contains("FK_") && exc.InnerException.Message.Contains("DELETE"))
            {
                return new ForeignKeyException("The record already has been used in elsewhere");
            }

            if (exc.InnerException.Message.Contains("FK_") && (exc.InnerException.Message.Contains("UPDATE") || exc.InnerException.Message.Contains("INSERT")))
            {
                return new ValueNotFoundException("Value not found");
            }

            if (exc.InnerException.Message.Contains("IX_"))
            {
                return new UniqueConstraintException("The record already exists");
            }

            if (exc.InnerException.Message.Contains("UQ_"))
            {
                return new UniqueConstraintException("The record already exists");
            }

            if (exc.InnerException.Message.Contains("PK_"))
            {
                return new PrimaryKeyException("The record already exists");
            }

            if (!(exc.InnerException is SqlException))
            {
                return exc;
            }

            var sqle = (SqlException)exc.InnerException;
            return sqle.Class == 16 ? new TmsException(sqle.Message, exc) : exc;
        }
    }
}
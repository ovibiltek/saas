using NHibernate;
using System;

namespace Ovi.Task.Data.Extensions
{
    public static class QueryExtensions
    {
        public static void SetInt32(this IQuery query, int position, int? val)
        {
            if (val.HasValue)
            {
                query.SetInt32(position, val.Value);
            }
            else
            {
                query.SetParameter(position, null, NHibernateUtil.Int32);
            }
        }

        public static void SetInt32(this IQuery query, string name, int? val)
        {
            if (val.HasValue)
            {
                query.SetInt32(name, val.Value);
            }
            else
            {
                query.SetParameter(name, null, NHibernateUtil.Int32);
            }           
        }

        public static void SetDateTime(this IQuery query, int position, DateTime? val)
        {
            if (val.HasValue)
            {
                query.SetDateTime(position, val.Value);
            }
            else
            {
                query.SetParameter(position, null, NHibernateUtil.DateTime);
            }
        }

        public static void SetDateTime(this IQuery query, string name, DateTime? val)
        {
            if (val.HasValue)
            {
                query.SetDateTime(name, val.Value);
            }
            else
            {
                query.SetParameter(name, null, NHibernateUtil.DateTime);
            }        
        }
    }
}
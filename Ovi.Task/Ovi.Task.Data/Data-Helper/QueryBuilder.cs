using System;
using System.Collections;

namespace Ovi.Task.Data.Helper
{
    internal class QueryBuilder
    {
        private string spc = " ";

        public string BuildBasic(string _operator, string fieldName, object value, Type fieldType)
        {
            _operator = _operator.ToLower();
            string op = null;

            string val = value.ToString();
            if (fieldType.Name == "String")
                val = "'" + val + "'";
            if (fieldType.Name == "DateTime")
            {
                val = "'" + val + "'";
            }

            switch (_operator)
            {
                case "eq":
                    op = "=";
                    break;

                case "gt":
                    op = ">";
                    break;

                case "gte":
                    op = ">=";
                    break;

                case "lt":
                    op = "<";
                    break;

                case "lte":
                    op = "<=";
                    break;

                default:
                    op = "=";
                    break;
            }

            string str = spc + fieldName + spc + op + spc + val + spc;

            return str;
        }

        public string Like(string fieldName, object value, string matchmode)
        {
            matchmode = matchmode.ToLower();

            string val = value.ToString();
            string op = "like";
            switch (matchmode)
            {
                case "start":
                    val = "'" + val + "%" + "'";
                    break;

                case "end":
                    val = "'" + "%" + val + "'";
                    break;

                case "anywhere":
                    val = "'" + "%" + val + "%" + "'";
                    break;

                default:
                    val = "'" + "%" + val + "%" + "'";
                    break;
            }

            string str = spc + fieldName + spc + op + spc + val + spc;
            return str;
        }

        public string Not(string query)
        {
            return "not(" + query + ")";
        }

        public string Logical(string logic, string query1, string query2)
        {
            logic = logic.ToLower();
            string op = null;
            switch (logic)
            {
                case "and":
                    op = "and";
                    break;

                case "or":
                    op = "or";
                    break;

                default:
                    op = "and";
                    break;
            }

            return spc + query1 + spc + op + spc + query2 + spc;
        }

        public string In(string fieldName, ICollection values, Type fieldType)
        {
            object[] array = new object[values.Count];
            values.CopyTo(array, 0);
            if (fieldType.Name == "String" || fieldType.Name == "DateTime")
            {
                for (int i = 0; i < array.Length; i++)
                {
                    array[i] = "'" + array[i] + "'";
                }
            }
            string op = "in";
            string val = "(";
            for (int i = 0; i < array.Length; i++)
            {
                if (i > 0)
                    val = val + ", ";
                val = val + array[i];
            }
            val = val + ")";

            return spc + fieldName + spc + op + spc + val + spc;
        }

        public string IsNull(string fieldName)
        {
            return spc + fieldName + " is null" + spc;
        }

        public string IsNotNull(string fieldName)
        {
            return spc + fieldName + " is not null" + spc;
        }

        public string Sql(object value)
        {
            return spc + value.ToString() + spc;
        }
    }
}
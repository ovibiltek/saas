using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Api;
using System;
using System.Collections;
using System.ComponentModel;
using System.Linq;
using TB.ComponentModel;

namespace Ovi.Task.UI.Helper
{
    public class GridDesignerHelper
    {
        //GridReq içindeki tip çevrimlerini gerçekleştirir.
        public static GridRequest SQLtoCsharpTypeConverter(GridRequest gridreq, string code)
        {
            RepositoryGridDesigner repositoryGridDesigner = new RepositoryGridDesigner();
            var colinf = repositoryGridDesigner.GetColumns(code);
            JArray jarr = JArray.FromObject(colinf);
            foreach (var item in gridreq.filter.Filters)
            {
                var token = jarr.SelectTokens("$..COLUMN_NAME").First(x => (string)x == item.Field).Parent.Parent;
                var sqltype = token.SelectToken("$..DATA_TYPE").Value<string>();
                switch (sqltype)
                {
                    case "bigint":
                        item.FieldType = typeof(long?);
                        break;

                    case "binary":
                    case "image":
                    case "timestamp":
                    case "varbinary":
                        item.FieldType = typeof(byte[]);
                        break;

                    case "bit":
                        item.FieldType = typeof(byte);
                        break;

                    case "nvarchar":
                    case "char":
                    case "nchar":
                    case "ntext":
                    case "text":
                    case "varchar":
                    case "xml":
                        item.FieldType = typeof(string);
                        break;

                    case "int":
                        item.FieldType = typeof(int);
                        break;

                    case "datetime":
                    case "smalldatetime":
                    case "date":
                    case "time":
                    case "datetime2":
                        item.FieldType = typeof(DateTime);
                        //item.Value1 = item.Value1 != null ? DateTime.Parse((string)item.Value1) : null;
                        //item.Value2 = item.Value2 != null ? DateTime.Parse((string)item.Value2) : null;
                        //item.Value3 = item.Value3 != null ? DateTime.Parse((string)item.Value3) : null;
                        //item.Value4 = item.Value4 != null ? DateTime.Parse((string)item.Value4) : null;
                        break;

                    case "numeric":
                    case "decimal":
                    case "money":
                    case "smallmoney":
                        item.FieldType = typeof(decimal);
                        break;

                    case "float":
                        item.FieldType = typeof(double);
                        break;

                    case "real":
                        item.FieldType = typeof(float);
                        break;

                    case "smallint":
                        item.FieldType = typeof(short);
                        break;

                    case "tinyint":
                        item.FieldType = typeof(byte);
                        break;

                    case "variant":
                    case "udt":
                        item.FieldType = typeof(object);
                        break;

                    case "datetimeoffset":
                        item.FieldType = typeof(DateTimeOffset);
                        break;

                    default:
                        item.FieldType = typeof(string);
                        break;
                }
            }

            return gridreq;
        }

        //Tablo içerisindeki Sütun isim- değer sözlüğünü oluşturur. İleride(js) Sütun adı ve değerini okumak için kullanılmıştır.
        //Mapping olmadığı için gereklidir.
        public static System.Collections.IList CreateDictionary(System.Collections.IList grid)
        {
            JArray nlist = new JArray();
            foreach (var item in grid)
            {
                var s = (Hashtable)item;
                JObject o = new JObject();
                foreach (DictionaryEntry de in s)
                {
                    if (de.Value == null)
                    {
                        o[de.Key] = null;
                    }
                    else
                    {
                        o[de.Key] = JToken.FromObject(de.Value);
                    }
                }
                nlist.Add(o);
            }

            return nlist;
        }

        public static void SaveToScreens(TMGRIDDESIGNER grid)
        {
            ApiScreensController apiScreensController = new ApiScreensController();

            var obj = JsonConvert.DeserializeObject(grid.GRD_TITLE);
            var arr = JArray.FromObject(obj);
            string title = "";
            foreach (var jtok in arr)
            {
                if (jtok["TR"] != null)
                    title = jtok["TR"].ToString();
            }
            TMSCREENS screen = new TMSCREENS();
            screen.SCR_CODE = grid.GRD_SCREENCODE;
            screen.SCR_URL = "/Grid?scrcode=" + grid.GRD_SCREENCODE;
            screen.SCR_ACTIVE = '+';
            screen.SCR_CREATED = grid.GRD_CREATED;
            screen.SCR_CREATEDBY = grid.GRD_CREATEDBY;
            screen.SCR_DESC = title;

            apiScreensController.Save(screen);
        }
    }
}
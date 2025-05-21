using Ovi.Task.Data.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ovi.Task.Data.DAO
{
    public class GridRequest
    {
        public GridRequest()
        {
            pageSize = DbSettings.MaxResultCount;
            page = 1;
        }

        public GridFilter GetFieldValueFromGridRequest(string fieldName)
        {
            // GridRequest veya filter boş ise null döndür
            if (this?.filter?.Filters == null)
                return null;

            // Filtrelerden fieldName ile eşleşeni bul
            var fieldFilter = this.filter.Filters
                .FirstOrDefault(f => f.Field.Equals(fieldName, StringComparison.OrdinalIgnoreCase));

            // Eşleşme varsa Value döndür, yoksa null
            return fieldFilter;
        }

        public int? skip { get; set; }

        public int take { get; set; }

        public int page { get; set; }

        public int pageSize { get; set; }

        public List<GridSort> sort { get; set; }

        public GridFilters filter { get; set; }

        public List<GridFilters> groupedFilters { get; set; }

        public string action { get; set; }

        public bool loadall { get; set; }

        public bool exportall { get; set; }

        public string screen { get; set; }

    }

    public class GridFilter
    {
        public string Operator { get; set; }

        public string Field { get; set; }

        public Type FieldType { get; set; }


        public object Value { get; set; }

        public object Value1 { get; set; }

        public object Value2 { get; set; }

        public object Value3 { get; set; }

        public object Value4 { get; set; }

        public string Logic { get; set; }
    }

    public class GridFilters
    {
        public List<GridFilter> Filters { get; set; }

        public string Logic { get; set; }
    }

    public class GridFilterGroups
    {
        public List<GridFilters> Filters { get; set; }
    }

    public class GridSort
    {
        public string Field { get; set; }

        public string Dir { get; set; }
    }
}
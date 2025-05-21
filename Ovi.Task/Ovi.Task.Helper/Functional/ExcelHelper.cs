using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using Ovi.Task.Helper.Shared;
using System.Collections.Generic;
using System.Globalization;
using System.IO;

namespace Ovi.Task.Helper.Functional
{
    public class ExcelHelper
    {
        public static List<string[]> GetLines(Stream stream, string extension)
        {
            var lines = new List<string[]>();
            if (extension.Equals(".xlsx"))
            {
                var XSSFWorkbook = new XSSFWorkbook(stream);
                var sheet = XSSFWorkbook.GetSheetAt(0);
                for (var row = 0; row <= sheet.LastRowNum; row++)
                {
                    if (sheet.GetRow(row) != null)
                    {
                        var cellsarr = GetCellsArray(sheet, row);
                        if (cellsarr != null)
                        {
                            lines.Add(cellsarr);
                        }
                    }
                }
            }
            else
            {
                var hssfwb = new HSSFWorkbook(stream);
                var sheet = hssfwb.GetSheetAt(0);
                for (var row = 0; row <= sheet.LastRowNum; row++)
                {
                    if (sheet.GetRow(row) != null)
                    {
                        var cellsarr = GetCellsArray(sheet, row);
                        if (cellsarr != null)
                        {
                            lines.Add(cellsarr);
                        }
                    }
                }
            }

            return lines;
        }

        private static string[] GetCellsArray(ISheet sheet, int row)
        {
            var physicalNumberOfCells = sheet.GetRow(row).PhysicalNumberOfCells;
            if (physicalNumberOfCells == 0)
            {
                return null;
            }

            var cellcount = sheet.GetRow(0).LastCellNum;
            var cellsarr = new string[cellcount];

            for (var i = 0; i < cellcount; i++)
            {
                var cell = sheet.GetRow(row).GetCell(i, MissingCellPolicy.CREATE_NULL_AS_BLANK);
                switch (cell.CellType)
                {
                    case CellType.String:
                        cellsarr[i] = cell.StringCellValue;
                        break;

                    case CellType.Unknown:
                        cellsarr[i] = cell.StringCellValue;
                        break;

                    case CellType.Numeric:
                        cellsarr[i] = DateUtil.IsCellDateFormatted(cell)
                            ? cell.DateCellValue.ToString(OviShared.LongDate)
                            : cell.NumericCellValue.ToString(CultureInfo.InvariantCulture);
                        break;

                    case CellType.Formula:
                        break;

                    case CellType.Blank:
                        cellsarr[i] = string.Empty;
                        break;

                    case CellType.Boolean:
                        break;

                    case CellType.Error:
                        break;
                }
            }
            return cellsarr;
        }        
    }
}
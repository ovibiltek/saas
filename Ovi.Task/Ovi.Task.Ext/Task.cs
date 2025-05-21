using Ovi.Task.Ext.tr.com.shaya.boysweb;
using System;

namespace Ovi.Task.Ext
{
    public class Malzeme
    {
        public string AmbarKodu { get; set; }

        public double BirimFiyat { get; set; }

        public string ParaBirimi { get; set; }

        public string MalzemeKodu { get; set; }

        public double Miktar { get; set; }
    }
    public class Task
    {
        public string HariciSistemFormNo { get; set; }

        public string IsemriNo { get; set; }

        public DateTime IsBaslangicTarihi { get; set; }

        public DateTime? IsBitisTarihi { get; set; } 

        public DateTime? IsTamamlanmaTarihi { get; set; }

        public string YapilanIs { get; set; }

        public string FaturaTipi { get; set; }

        public string HakedisYili { get; set; }

        public string HakedisAyi { get; set; }

        public string  Ambar { get; set; }

        public string ArizaNedeniKodu { get; set; }

        public string ArizaCozumuKodu { get; set; }

        public WorkOrderItem[] KullanılanMalzemeler { get; set; }

        public WorkOrderService[] Hizmetler { get; set; }


    }
}
using System;

namespace Ovi.Task.Data.Entity.CustomerReport
{
    public class TM_RPTCUSTOMER_EQUIPMENT_RESULT
    {
        public string MUSTERI { get; set; }

        public string TANIM { get; set; }

        public string GRUP { get; set; }

        public DateTime MUSTERI_OLUSTURMA { get; set; }

        public string AKTIF { get; set; }

        public int TOPLAM_SUBE { get; set; }

        public int TOPLAM_AKTIF_SUBE { get; set; }

        public int TOPLAM_BAKIM_IS_EMRI { get; set; }

        public int TOPLAM_BAKIM_YAPILAN_SUBE { get; set; }

        public int EKIPMANI_OLAN_SUBE { get; set; }

        public int EKIPMANI_OLMAYAN_SUBE { get; set; }

        public int TOPLAM_EKIPMAN_SAYISI { get; set; }
    }
}
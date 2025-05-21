var uploadutilitystrings = {
    EN: {
        // Contract Part Prices
        'BCOPP': "<strong>The file must contain the following columns:</strong><br/>" +
            "<span class=\"required\">Contract ID</span><br/>" +
            "<span class=\"required\">Part Code</span><br/>" +
            "Region<br/>" +
            "Branch<br/>" +
            "Reference<br/>" +
            "Unit Purchase Price<br/>" +
            "<span class=\"required\">Unit Sales Price</span><br/>" +
            "<span class=\"required\">Currency</span>",
        // Contract Equipment Maintenance Price
        'BCMP': "<strong>The file must contain the following columns:</strong><br/>" +
            "<span class=\"required\">Contract ID</span><br/>" +
            "Periodic Task<br/>" +
            "<span class=\"required\">Equipment Type</span><br/>" +
            "Region<br/>" +
            "Branch<br/>" +
            "Equipment<br/>" +
            "Reference<br/>" +
            "<span class=\"required\">Unit Purchase Price</span><br/>" +
            "<span class=\"required\">Unit Sales Price</span><br/>" +
            "<span class=\"required\">Currency</span>",

        // Contract Service Prices
        'BCSC': "<strong>The file must contain the following columns:</strong><br/>" +
            "<span class=\"required\">Contract No</span><br/>" +
            "<span class=\"required\">Service Code</span><br/>" +
            "Region<br/>" +
            "Branch<br/>" +
            "<span class=\"required\">Unit Purchase Price</span><br/>" +
            "<span class=\"required\">Unit Sales Price</span><br/>" +
            "<span class=\"required\">Currency</span><br/>" +
            "Reference",
        // Service Code
        'BSRC': "<strong>The file must contain the following columns:</strong><br/>" +
            "<span class=\"required\">Description</span><br/>" +
            "<span class=\"required\">Organization</span><br/>" +
            "<span class=\"required\">Uom</span><br/>" +
            "<span class=\"required\">Type</span><br/>" +
            "<span class=\"required\">Hierarchy</span><br/>" +
            "<span class=\"required\">Unit Price</span><br/>" +
            "<span class=\"required\">Unit Price Currency</span><br/>" +
            "<span class=\"required\">Unit Sales Price</span><br/>" +
            "Task Type<br/>" +
            "<span class=\"required\">Active</span>",
        // Branch
        'BBRN': "<strong>The file must contain the following columns:</strong><br/>" +
            "<span class=\"required\">Branch Description</span><br/>" +
            "<span class=\"required\">Organization</span><br/>" +
            "<span class=\"required\">Branch Type</span><br/>" +
            "<span class=\"required\">Customer</span><br/>" +
            "Operations officer<br/>" +
            "Project Manager<br/>" +
            "Authorized<br/>" +
            "Customer Service Representative E-mail<br/>" +
            "<span class=\"required\">Region</span><br/>" +
            "<span class=\"required\">Province</span><br/>" +
            "District<br/>" +
            "Neighborhood<br/>" +
            "Street<br/>" +
            "Door number<br/>" +
            "Open address <br/>" +
            "<span class=\"required\">Active (+, -)</span><br/>" +
            "Reference<br/>" +
            "Under Maintenance (+, -)<br/>" +
            "Customer Zone",
        // Task
        'BTSK': "<strong>The file must contain the following columns:</strong><br/>" +
            "<span class=\"required\">Organization</span><br/>" +
            "<span class=\"required\">Department</span><br/>" +
            "<span class=\"required\">Type</span><br/>" +
            "<span class=\"required\">Category</span><br/>" +
            "Task Type<br/>" +
            "<span class=\"required\">Description</span><br/>" +
            "<span class=\"required\">Customer</span><br/>" +
            "<span class=\"required\">Branch</span><br/>" +
            "<span class=\"required\">Location</span><br/>" +
            "<span class=\"required\">Priority (ACIL,NORMAL)</span><br/>" +
            "Date Deadline<br/>" +
            "<span class=\"required\">Requested By</span><br/>" +
            "Comments<br/>" +
            "Activity Trade<br/>" +
            "Reporting Required<br/>" +
            "Waiting For Work Permit<br/>" +
            "Periodic Task<br/>" +
            "Service Code<br/>" +
            "Reporting Supplier<br/>" +
            "Equipment<br/>" +
            "Active Planning Date<br/>" +
            "Reference<br/>" +
            "Contract No<br/>" + 
            "Task Details",

        // Periodic Task Parameters
        'BPTP': "<strong>The file must contain the following columns in sequence:</strong><br>" +
            "<span class=\"required\">Periodic Task</span><br>" +
            "Equipment<br>" +
            "Location<br>" +
            "<span class=\"required\">Plan Date</span><br>" +
            "Trade 1<br>" +
            "Reporting Required",
        // Location
        'BLOC': "<strong>The file must contain the following columns:</strong><br/>" +
            "<span class=\"required\">Code</span><br/>" +
            "<span class=\"required\">Description</span><br/>" +
            "<span class=\"required\">Organization</span><br/>" +
            "<span class=\"required\">Department</span><br/>" +
            "<span class=\"required\">Branch</span><br/>" +
            "Parent<br/>" +
            "Latitude<br/>" +
            "Longitude<br/>" +
            "Barcode<br/>" +
            "Active",
        // User
        'BUSR': "<strong>The file must contain the following columns:</strong><br/>" +
            "<span class=\"required\">Code</span><br/>" +
            "<span class=\"required\">Description</span><br/>" +
            "<span class=\"required\">Organization</span><br/>" +
            "<span class=\"required\">Department</span><br/>" +
            "Authorized Departments<br/>" +
            "<span class=\"required\">User Group</span><br/>" +
            "<span class=\"required\">Trade</span><br/>" +
            "<span class=\"required\">Type</span><br/>" +
            "Timekeeping Officer<br/>" +
            "<span class=\"required\">Language</span><br/>" +
            "Pricing Code<br/>" +
            "<span class=\"required\">E Mail</span><br/>" +
            "Customer<br/>" +
            "Supplier<br/>" +
            "Alternative E-Mail<br/>" +
            "Start Date<br/>" +
            "End Date<br/>" +
            "View Weekly Calendar<br/>" +
            "TMS<br/>" +
            "Mobile<br/>" +
            "Requestor<br/>" +
            "Active<br/>" +
            "<span class=\"required\">Pass</span><br/>" +
            "Branch",
        // Inventory Receipt / Stock Take
        'BRST': "<strong>The file must contain the following columns:</strong><br>" +
            "<span class=\"required\">Code</span><br>" +
            "<span class=\"required\">Part</span><br>" +
            "<span class=\"required\">Bin</span><br>" +
            "<span class=\"required\">Quantity</span><br>" +
            "<span class=\"required\">Price</span>",
        // Equipments - with type
        'BEQP-*': "<strong>The file must contain the following columns in sequence:</strong><br>" +
            "<span class=\"required\">Equipment Code</span><br>" +
            "<span class=\"required\">Organization</span><br>" +
            "<span class=\"required\">Department</span><br>" +
            "<span class=\"required\">Description</span><br>" +
            "<span class=\"required\">Brand</span><br>" +
            "<span class=\"required\">Model</span><br>" +
            "<span class=\"required\">Serial No</span><br>" +
            "<span class=\"required\">Guarantee Status (Have = HAVE, Not Have = NOTHAVE, Unknown = UNKNOWN)</span><br>" +
            "<span class=\"required\">Periodic Maintenance Required (Yes = YES, No = NO)</span><br>" +
            "Reference<br>" +
            "Installation Date<br>" +
            "Parent Equipment<br>" +
            "<span class=\"required\">Customer</span><br>" +
            "<span class=\"required\">Branch</span><br>" +
            "<span class=\"required\">Location</span><br>" +
            "<span class=\"required\">Active/Passive</span><br>" +
            "<span class=\"required\">Type</span><br>" +
            "Capacity",
        // Equipments - without type
        'EQUIPMENT': "<strong>The file must contain the following columns in sequence:</strong><br>" +
            "<span class=\"required\">Equipment Code</span><br>" +
            "<span class=\"required\">Organization</span><br>" +
            "<span class=\"required\">Department</span><br>" +
            "<span class=\"required\">Description</span><br>" +
            "<span class=\"required\">Brand</span><br>" +
            "<span class=\"required\">Model</span><br>" +
            "<span class=\"required\">Serial No</span><br>" +
            "<span class=\"required\">Guarantee Status (Have = HAVE, Not Have = NOTHAVE, Unknown = UNKNOWN)</span><br>" +
            "<span class=\"required\">Periodic Maintenance Required (Yes = YES, No = NO)</span><br>" +
            "Reference<br>" +
            "Installation Date<br>" +
            "Parent Equipment<br>" +
            "<span class=\"required\">Customer</span><br>" +
            "<span class=\"required\">Branch</span><br>" +
            "<span class=\"required\">Location</span><br>" +
            "<span class=\"required\">Active/Passive</span>",
        // Part Transactions
        'BTPR': "<strong>The file must contain the following columns:</strong><br>" +
            "<span class=\"required\">Task</span><br>" +
            "<span class=\"required\">Activity</span><br>" +
            "<span class=\"required\">Transaction Type (Issue(I)/Return(RT))</span><br>" +
            "<span class=\"required\">Warehouse</span><br>" +
            "<span class=\"required\">Part</span><br>" +
            "Part Reference<br>" +
            "<span class=\"required\">Bin</span><br>" +
            "<span class=\"required\">Quantity</span>",
        // Quotation Parts
        'BQPR': "<strong>The file must contain the following columns:</strong><br>" +
            "<span class=\"required\">Quotation</span><br>" +
            "<span class=\"required\">Part</span><br>" +
            "<span class=\"required\">Brand</span><br>" +
            "<span class=\"required\">Quantity</span><br>" +
            "Part Reference<br>" +
            "Unit Purchase Price<br>" +
            "Purchase Discount Rate<br>" +
            "Purchase Currency<br>" +
            "Purchase Exchange Rate<br>" +
            "Unit Sales Price<br>" +
            "Sales Discount Rate<br>" +
            "Sales Currency<br>" +
            "Sales Exchange Rate",
        // Parts
        'BPAR': "<strong>The file must contain the following columns:</strong><br>" +
            "<span class=\"required\">Organization</span><br>" +
            "<span class=\"required\">Type</span><br>" +
            "<span class=\"required\">Hierarchy</span><br>" +
            "Description<br>" +
            "Brand<br>" +
            "<span class=\"required\">UOM</span><br>" +
            "Unit Sales Price<br>" +
            "Currency<br>" +
            "Active/Passive (+/-)",
        'BDLT': "<strong>The file must contain the following columns:</strong><br>" +
            "<span class=\"required\">Task</span>" 
    },
    TR: {
        // Sözleşme Parca Fiyatları
        'BCOPP': "<strong>Yüklenecek dosya aşağıdaki sütunları içermelidir:</strong><br/>" +
            "<span class=\"required\">Sözleşme No</span><br/>" +
            "<span class=\"required\">Parça Kodu</span><br/>" +
            "Bölge<br/>" +
            "Şube<br/>" +
            "Reference<br/>" +
            "Alış Birim Fiyatı<br/>" +
            "<span class=\"required\">Satış Birim Fiyatı</span><br/>" +
            "<span class=\"required\">Para Birimi</span>",
        // Sözleşme Ekipman Bazlı Bakım Fiyatları
        'BCMP': "<strong>Yüklenecek dosya aşağıdaki sütunları içermelidir:</strong><br/>" +
            "<span class=\"required\">Sözleşme No</span><br/>" +
            "Periyodik Görev<br/>" +
            "<span class=\"required\">Ekipman Tipi</span><br/>" +
            "Bölge<br/>" +
            "Şube<br/>" +
            "Ekipman<br/>" +
            "Referans<br/>" +
            "<span class=\"required\">Alış Birim Fiyatı</span><br/>" +
            "<span class=\"required\">Satış Birim Fiyatı</span><br/>" +
            "<span class=\"required\">Para Birimi</span>",
        // Sözleşme İşçili Kodları
        'BCSC': "<strong>Yüklenecek dosya aşağıdaki sütunları içermelidir:</strong><br/>" +
            "<span class=\"required\">Sözleşme No</span><br/>" +
            "<span class=\"required\">İşçilik Kodu</span><br/>" +
            "Bölge<br/>" +
            "Şube<br/>" +
            "<span class=\"required\">Alış Birim Fiyatı</span><br/>" +
            "<span class=\"required\">Satış Birim Fiyatı</span><br/>" +
            "<span class=\"required\">Para Birimi</span><br/>" +
            "Referans",
        // İşçilik Kodu
        'BSRC': "<strong>Yüklenecek dosya aşağıdaki sütunları içermelidir:</strong><br/>" +
            "<span class=\"required\">Tanım</span><br/>" +
            "<span class=\"required\">Organizasyon</span><br/>" +
            "<span class=\"required\">Birim</span><br/>" +
            "<span class=\"required\">Tip</span><br/>" +
            "<span class=\"required\">Hiyerarşi</span><br/>" +
            "<span class=\"required\">Birim Fiyat</span><br/>" +
            "<span class=\"required\">Para Birimi</span><br/>" +
            "<span class=\"required\">Birim Satış Fiyatı</span><br/>" +
            "Görev Türü<br/>" +
            "<span class=\"required\">Aktif</span>",
        // Sube
        'BBRN': "<strong>Yüklenecek dosya aşağıdaki sütunları içermelidir:</strong><br/>" +
            "<span class=\"required\">Şube Tanımı</span><br/>" +
            "<span class=\"required\">Organizasyon</span><br/>" +
            "<span class=\"required\">Şube Tipi</span><br/>" +
            "<span class=\"required\">Müşteri</span><br/>" +
            "Operasyon Yetkilisi<br/>" +
            "Müşteri Yöneticisi<br/>" +
            "Müşteri Yetkilisi<br/>" +
            "Müşteri Yetkilisi E-Posta<br/>" +
            "<span class=\"required\">Bölge</span><br/>" +
            "<span class=\"required\">İl</span><br/>" +
            "İlçe<br/>" +
            "Mahalle<br/>" +
            "Sokak/Cadde<br/>" +
            "Kapı No<br/>" +
            "Açık Adres<br/>" +
            "<span class=\"required\">Aktif(+,-)</span><br/>" +
            "Referans<br/>" +
            "Bakım Dahilinde(+,-)<br/>" +
            "Müşteri Bölgesi",
        // Gorev
        'BTSK': "<strong>Yüklenecek dosya aşağıdaki sütunları içermelidir:</strong><br/>" +
            "<span class=\"required\">Organizasyon</span><br/>" +
            "<span class=\"required\">Departman</span><br/>" +
            "<span class=\"required\">Tip</span><br/>" +
            "<span class=\"required\">Kategori</span><br/>" +
            "Tür<br/>" +
            "<span class=\"required\">Tanım</span><br/>" +
            "<span class=\"required\">Müşteri</span><br/>" +
            "<span class=\"required\">Şube</span><br/>" +
            "<span class=\"required\">Lokasyon</span><br/>" +
            "<span class=\"required\">Öncelik (ACIL,NORMAL)</span><br/>" +
            "İstenen Tarih<br/>" +
            "<span class=\"required\">Talep Eden</span><br/>" +
            "Yorum<br/>" +
            "Aktivite Ekibi<br/>" +
            "Raporlama Gerekli<br/>" +
            "İş İzni Bekleniyor<br/>" +
            "Periyodik Görev<br/>" +
            "İşçilik Kodu<br/>" +
            "Raporlama Tedarikçisi<br/>" +
            "Ekipman<br/>" +
            "Aktif Plan Tarihi<br/>" +
            "Referans<br/>" +
            "Sözleşme No<br/>" +
            "Görev Detayı",
        // Periyodik Görev Parametreleri
        'BPTP': "<strong>Yüklenecek dosya aşağıdaki sütunları sıra ile içermelidir:</strong><br>" +
            "<span class=\"required\">Periyodik Görev</span><br>" +
            "Ekipman<br>" +
            "Lokasyon<br>" +
            "<span class=\"required\">Plan Tarihi</span><br>" +
            "Ekip<br>" +
            "Rapor Gerekli",
        // Lokasyon
        'BLOC': "<strong>Yüklenecek dosya aşağıdaki sütunları içermelidir:</strong><br/>" +
            "<span class=\"required\">Kod </span><br/>" +
            "<span class=\"required\">Tanım </span><br/>" +
            "<span class=\"required\">Organizasyon </span><br/>" +
            "<span class=\"required\">Departman </span><br/>" +
            "<span class=\"required\">Şube </span><br/>" +
            "Üst <br/>" +
            "Enlem <br/>" +
            "Boylam <br/>" +
            "Barkod <br/>" +
            "Aktif",
        // Kullanıcı
        'BUSR': "<strong>Yüklenecek dosya aşağıdaki sütunları içermelidir:</strong><br/>" +
            "<span class=\"required\">Kod</span><br/>" +
            "<span class=\"required\">Tanım</span><br/>" +
            "<span class=\"required\">Organizasyon</span><br/>" +
            "<span class=\"required\">Departman</span><br/>" +
            "Yetkili Departmanlar<br/>" +
            "<span class=\"required\">Kullanıcı Grubu</span><br/>" +
            "<span class=\"required\">Ekip</span><br/>" +
            "<span class=\"required\">Kullanıcı Tipi</span><br/>" +
            "Puantaj Sorumlusu<br/>" +
            "<span class=\"required\">Dil</span><br/>" +
            "Fiyatlandırma Kodu<br/>" +
            "<span class=\"required\">E-Posta</span><br/>" +
            "Müşteri<br/>" +
            "Tedarikçi<br/>" +
            "Alternatif E-Posta<br/>" +
            "Baş. Tarihi<br/>" +
            "Bitiş Tarihi<br/>" +
            "Haftalık Takvimi Görüntüle<br/>" +
            "TMS<br/>" +
            "Mobil<br/>" +
            "İstekçi<br/>" +
            "Aktif<br/>" +
            "<span class=\"required\">Şifre</span><br/>" +
            "Şube",
        //Stok Girişi / Stok Düzeltme(-)
        'BRST': "<strong>Yüklenecek dosya aşağıdaki sütunları içermelidir:</strong><br>" +
            "<span class=\"required\">Kod<br>" +
            "<span class=\"required\">Parça</span><br>" +
            "<span class=\"required\">Raf</span><br>" +
            "<span class=\"required\">Miktar</span><br>" +
            "<span class=\"required\">Fiyat</span>",
        // Ekipman -tip içerir
        'BEQP-*': "<strong>Yüklenecek dosya aşağıdaki sütunları sıra ile içermelidir:</strong><br>" +
            "<span class=\"required\">Ekipman Kodu</span><br>" +
            "<span class=\"required\">Organizasyon</span><br>" +
            "<span class=\"required\">Departman</span><br>" +
            "<span class=\"required\">Tanım</span><br>" +
            "<span class=\"required\">Marka</span><br>" +
            "<span class=\"required\">Model</span><br>" +
            "<span class=\"required\">Seri No</span><br>" +
            "<span class=\"required\">Garanti Durumu (Var = HAVE, Yok = NOTHAVE, Bilinmiyor = UNKNOWN)</span><br>" +
            "<span class=\"required\">Periyodik Bakım Gerekli (Evet = YES, Hayır = NO)</span><br>" +
            "Referans<br>" +
            "Kurulum Tarihi<br>" +
            "Üst Ekipman<br>" +
            "<span class=\"required\">Müşteri</span><br>" +
            "<span class=\"required\">Şube</span><br>" +
            "<span class=\"required\">Lokasyon</span><br>" +
            "<span class=\"required\">Aktif/Pasif</span><br>" +
            "<span class=\"required\">Tip</span><br>" +
            "Kapasite",
        // Ekipman - tip içermez
        'EQUIPMENT': "<strong>Yüklenecek dosya aşağıdaki sütunları sıra ile içermelidir:</strong><br>" +
            "<span class=\"required\">Ekipman Kodu</span><br>" +
            "<span class=\"required\">Organizasyon</span><br>" +
            "<span class=\"required\">Departman</span><br>" +
            "<span class=\"required\">Tanım</span><br>" +
            "<span class=\"required\">Marka</span><br>" +
            "<span class=\"required\">Model</span><br>" +
            "<span class=\"required\">Seri No</span><br>" +
            "<span class=\"required\">Garanti Durumu (Var = HAVE, Yok = NOTHAVE, Bilinmiyor = UNKNOWN)</span><br>" +
            "<span class=\"required\">Periyodik Bakım Gerekli (Evet = YES, Hayır = NO)</span><br>" +
            "Referans<br>" +
            "Kurulum Tarihi<br>" +
            "Üst Ekipman<br>" +
            "<span class=\"required\">Müşteri</span><br>" +
            "<span class=\"required\">Şube</span><br>" +
            "<span class=\"required\">Lokasyon</span><br>" +
            "<span class=\"required\">Aktif/Pasif</span>",
        // Part Transactions
        'BTPR': "<strong>Yüklenecek dosya aşağıdaki sütunları sıra ile içermelidir:</strong><br>" +
            "<span class=\"required\">Görev</span><br>" +
            "<span class=\"required\">Aktivite</span><br>" +
            "<span class=\"required\">İşlem Tipi (Çıkış(I)/İade(RT))</span><br>" +
            "<span class=\"required\">Depo</span><br>" +
            "<span class=\"required\">Parça</span><br>" +
            "Parça Referansı<br>" +
            "<span class=\"required\">Raf</span><br>" +
            "<span class=\"required\">Miktar</span>",
        // Quotation Parts
        'BQPR': "<strong>Yüklenecek dosya aşağıdaki sütunları sıra ile içermelidir:</strong><br>" +
            "<span class=\"required\">Teklif</span><br>" +
            "<span class=\"required\">Parça</span><br>" +
            "<span class=\"required\">Marka</span><br>" +
            "<span class=\"required\">Miktar</span><br>" +
            "Parça Referansı<br>" +
            "Birim Alış Fiyatı<br>" +
            "Alış İskonto Oranı (%)<br>" +
            "Alış Para Birimi<br>" +
            "Alış Kuru<br>" +
            "Birim Satış Fiyatı<br>" +
            "Satış İskonto Oranı (%)<br>" +
            "Satış Para Birimi<br>" +
            "Satış Kuru",
        //Parts
        'BPAR': "<strong>Yüklenecek dosya aşağıdaki sütunları sıra ile içermelidir:</strong><br>" +
            "<span class=\"required\">Organizasyon</span><br>" +
            "<span class=\"required\">Tip</span><br>" +
            "<span class=\"required\">Hiyerarşi</span><br>" +
            "Tanım<br>" +
            "Marka<br>" +
            "<span class=\"required\">Birim</span><br>" +
            "Birim Satış Fiyatı<br>" +
            "Para Birimi<br>" +
            "Aktif/Pasif (+/-)",
        'BDLT': "<strong>Yüklenecek dosya aşağıdaki sütunları sıra ile içermelidir:</strong><br>" +
            "<span class=\"required\">Görev</span>"
    }
}
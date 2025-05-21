var mobilephone = function (p) {
    var ho = p;

    var _loadPhonePrefix = function (v) {
        var gridreq = {
            sort: [{ field: "MPF_ID", dir: "asc" }]
        };

        return select({
            ctrl: ho.prefix,
            url: "/Api/ApiMobilePhonePrefix/List",
            keyfield: "MPF_VALUE",
            textfield: "MPF_VALUE",
            data: JSON.stringify(gridreq)
        }).Fill();
    };

    var _ready = function () {
        $(ho.prefix).css("width", "100%");
        $(ho.prefix).select2();
        return $.when(_loadPhonePrefix());
    }

    var getvalue = function () {
        return ($(ho.prefix).select2("val") || "") + ($(ho.number).val() || "") || null;
    }

    var setvalue = function (phonenumber) {
        if (phonenumber && phonenumber.length === 10) {
            console.log(phonenumber);
            $(ho.prefix).select2("val", phonenumber.substring(0, 3));
            $(ho.number).val(phonenumber.substring(3));
        }
        else {
            if (phonenumber) {
                switch (phonenumber[0]) {
                    case '+':
                        phonenumber = phonenumber.substring(3);
                        break;
                    case '9':
                        phonenumber = phonenumber.substring(2);
                        break;
                    case '0':
                        phonenumber = phonenumber.substring(1);
                        break;
                    default:
                        break;

                }
                $(ho.prefix).select2("val", phonenumber.substring(0, 3));
                $(ho.number).val(phonenumber.substring(3));
            }
            else {
                clear();
            }

           
         
      
        }

    }

    var clear = function () {
        $(ho.prefix).select2("val", "");
        $(ho.number).val("");
    }

    $(document).ready(_ready);

    return {
        getvalue: getvalue,
        setvalue: setvalue,
        clear : clear
    };
}
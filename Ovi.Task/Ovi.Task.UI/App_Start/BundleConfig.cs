using System.Web.Optimization;

namespace Ovi.Task.UI
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;
            bundles.UseCdn = true;
            bundles.Add(new StyleBundle("~/css/fonts", "//fonts.googleapis.com/css?family=Open+Sans"));
            bundles.Add(new StyleBundle("~/css/bootstrap")
                .Include("~/Content/bootstrap/bootstrap-datetimepicker.min.css")
                .Include("~/Content/bootstrap/bootstrap.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/bootstrap/star-rating.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/bootstrap/awesome-bootstrap-checkbox.css"));
            bundles.Add(new StyleBundle("~/css/kendo")
                .Include("~/Content/kendo/kendo.common.min.css")
                .Include("~/Content/kendo/kendo.bootstrap.min.css",new CssRewriteUrlTransform()));
            bundles.Add(new StyleBundle("~/css/jquery")
                .Include("~/Content/jquery/jquery.qtip.min.css")
                .Include("~/Content/jquery/jquery-ui.min.css")
                .Include("~/Content/jquery/jquery.scrollbar.css"));
            bundles.Add(new StyleBundle("~/css/default")
                .Include("~/Content/loading.css")
                .Include("~/Content/default.css")
                .Include("~/Content/auto-complete.css", new CssRewriteUrlTransform())
                .Include("~/Content/notification.css"));
            bundles.Add(new StyleBundle("~/css/other")
                .Include("~/Content/toastr/toastr.min.css")
                .Include("~/Content/viewer.min.css")
                .Include("~/Content/other/comboTreePlugin.css")
                .Include("~/Content/font-awesome.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/select2.css",new CssRewriteUrlTransform()));

            bundles.Add(new ScriptBundle("~/bundles/custom")
                .Include(
                    "~/Scripts/app/localization/applicationstrings.js",
                    "~/Scripts/app/localization/gridstrings.js",
                    "~/Scripts/custom/ovi.custom.shared.js",
                    "~/Scripts/custom/ovi.custom.ajax.js",
                    "~/Scripts/custom/ovi.custom.modal.js",
                    "~/Scripts/custom/ovi.custom.audit.js",
                    "~/Scripts/custom/ovi.custom.translation.js",
                    "~/Scripts/custom/ovi.custom.grid.js",
                    "~/Scripts/custom/ovi.custom.tooltip.js",
                    "~/Scripts/custom/ovi.custom.autocomp.js",
                    "~/Scripts/custom/ovi.custom.page.js",
                    "~/Scripts/custom/ovi.custom.notifications.js",
                    "~/Scripts/custom/ovi.custom.screennotifications.js",
                    "~/Scripts/custom/ovi.custom.select.js",
                    "~/Scripts/custom/ovi.custom.mobilephone.js"

            ));

            bundles.Add(new ScriptBundle("~/bundles/jquery")
                .Include(
                    "~/Scripts//jquery/jquery-2.2.3.min.js",
                    "~/Scripts/jquery/jquery-migrate-1.2.1.min.js",
                    "~/Scripts/jquery/jquery-ui.min.js",
                    "~/Scripts/jquery/jquery.scrollbar.min.js",
                    "~/Scripts/jquery/jquery.qtip.min.js",
                    "~/Scripts/jquery/jquery.blockUI.js",
                    "~/Scripts/jquery/jquery.marquee.min.js",
                    "~/Scripts/jquery/jquery.mask.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap")
                .Include(
                    "~/Scripts/bootstrap/bootstrap.min.js",
                    "~/Scripts/bootstrap/bootstrapx-clickover.js",
                    "~/Scripts/bootstrap/bootstrap-datetimepicker.min.js",
                    "~/Scripts/bootstrap/star-rating.min.js"
                ));
            bundles.Add(new ScriptBundle("~/bundles/xlsx")
                .Include(
                    "~/Scripts/xlsx/jszip.min.js",
                    "~/Scripts/xlsx/xlsx.full.min.js"
                ));
            bundles.Add(new ScriptBundle("~/bundles/velocity")
                .Include(
                    "~/Scripts/velocity/velocity.min.js",
                    "~/Scripts/velocity/velocity.ui.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/moment")
                .Include(
                    "~/Scripts/moment/moment.min.js",
                    "~/Scripts/moment/moment-duration-format.js",
                    "~/Scripts/moment/moment-range.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/kendo")
                .Include(
                    "~/Scripts/kendo/kendo.web.min.js",
                    "~/Scripts/kendo/kendo.web.plugins.extgrid.js"
                ));
            bundles.Add(new ScriptBundle("~/bundles/toastr")
                .Include(
                    "~/Scripts/toastr/toastr.min.js",
                    "~/Scripts/toastr/toastr.options.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/other")
                .Include(
                    "~/Scripts/other/underscore-min.js",
                    "~/Scripts/other/shortcut.js",
                    "~/Scripts/other/select2.min.js",
                    "~/Scripts/other/numericInput.min.js",
                    "~/Scripts/other/underscore-min.js",
                    "~/Scripts/other/viewer.min.js",
                    "~/Scripts/other/comboTreePlugin.js",
                    "~/Scripts/other/icontains.js",
                    "~/Scripts/other/renderMenu.js"

                ));
            bundles.Add(new ScriptBundle("~/bundles/tr")
                .Include(
                    "~/Scripts/moment/moment.tr.js",
                    "~/Scripts/kendo/kendo.tr-TR.js",
                    "~/Scripts/kendo/kendo.culture.tr-TR.min.js"
                ));
        }
    }
}
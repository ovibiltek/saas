namespace Ovi.Task.Data.DAO
{
    public class ProgressPaymentTaskItem
    {
        public long Task { get; set; }

        public string Prp { get; set; }
    }

    public class ProgressPaymentTask
    {
        public long Psp { get; set; }

        public ProgressPaymentTaskItem[] Items { get; set; }
    }
}
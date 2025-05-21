namespace Ovi.Task.Data.Entity{    public class TMHOLDREASONHISTORYVIEW    {        public virtual int TSK_ID { get; set; }        public virtual long? TSK_HOLDORDER { get; set; }        public virtual string TSK_HOLDREASON { get; set; }        public virtual string TSK_HOLDREASONDESC { get; set; }        public virtual int? TSK_HOLDDURATION { get; set; }        public virtual string TSK_UPDATEDBY { get; set; }        public override bool Equals(object obj)        {            var other = obj as TMHOLDREASONHISTORYVIEW;            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.TSK_ID == TSK_ID && other.TSK_HOLDORDER == TSK_HOLDORDER;        }
        public override int GetHashCode()        {            unchecked            {                return TSK_ID.GetHashCode() ^ TSK_HOLDORDER.GetHashCode();            }        }    }}
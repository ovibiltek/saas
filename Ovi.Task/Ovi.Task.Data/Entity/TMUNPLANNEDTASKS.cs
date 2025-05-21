namespace Ovi.Task.Data.Entity
{
    public class TMUNPLANNEDTASKS
    {
        public virtual string TSK_DEPARTMENT { get; set; }

        public virtual string TSK_USER { get; set; }

        public virtual long TSK_ID { get; set; }

        public virtual string TSK_ORGANIZATION { get; set; }

        public virtual long TSK_ACTLINE { get; set; }

        public virtual string TSK_ACTDESC { get; set; }

        public virtual string TSK_SHORTDESC { get; set; }

        public virtual string TSK_CUSTOMER { get; set; }

        public virtual string TSK_BRANCH { get; set; }

        public virtual string TSK_STATUS { get; set; }

        public virtual string TSK_STATUSDESC { get; set; }

        public virtual char TSK_CREATEDBYUSERTYPE { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMUNPLANNEDTASKS;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.TSK_DEPARTMENT == TSK_DEPARTMENT && other.TSK_USER == TSK_USER &&
                   other.TSK_ID == TSK_ID && other.TSK_ACTLINE == TSK_ACTLINE;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return TSK_DEPARTMENT.GetHashCode() ^ TSK_USER.GetHashCode() ^ TSK_ID.GetHashCode() ^
                       TSK_ACTLINE.GetHashCode();
            }
        }
    }
}
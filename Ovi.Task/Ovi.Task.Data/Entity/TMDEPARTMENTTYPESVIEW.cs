namespace Ovi.Task.Data.Entity
{
    public class TMDEPARTMENTTYPESVIEW
    {
        public virtual string TYP_ENTITY { get; set; }

        public virtual string TYP_CODE { get; set; }

        public virtual string TYP_DESC { get; set; }

        public virtual string TYP_DESCF { get; set; }

        public virtual string TYP_ORGANIZATION { get; set; }

        public virtual char TYP_SHOWINACTIONBOX { get; set; }

        public virtual string TYP_DEPARTMENT { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMDEPARTMENTTYPESVIEW;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.TYP_DEPARTMENT == TYP_DEPARTMENT && other.TYP_ENTITY == TYP_ENTITY &&
                   other.TYP_CODE == TYP_CODE;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return TYP_DEPARTMENT.GetHashCode() ^ TYP_ENTITY.GetHashCode() ^ TYP_CODE.GetHashCode();
            }
        }
    }
}
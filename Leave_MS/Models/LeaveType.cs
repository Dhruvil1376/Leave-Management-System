using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Leave_MS.Models
{
    public class LeaveType
    {
        [Key]
        public int LeaveTypeId {  get; set; }

        [Required,MaxLength(50)]
        public string TypeName {  get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string CssClass { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<LeaveBalance>? LeaveBalances { get; set; } = new List<LeaveBalance>();

        [JsonIgnore]
        public ICollection<LeaveRequest>? LeaveRequests { get; set; } = new List<LeaveRequest>();
    }
}

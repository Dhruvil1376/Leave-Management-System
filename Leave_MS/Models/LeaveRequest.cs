using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Leave_MS.Models
{
    public class LeaveRequest
    {
        [Key]
        public int LeaveRequestId { get; set; }

        [Required,ForeignKey("User")]
        public int UserId { get; set; }

        [Required,ForeignKey("LeaveType")]
        public int LeaveTypeId { get; set; }

        [Required,ForeignKey("Status")]
        public int StatusId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public int TotalDays { get; set; }

        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;

        [JsonIgnore]
        public User? User { get; set; }

        [JsonIgnore]
        public LeaveType? LeaveType { get; set; }

        [JsonIgnore]
        public Status? Status { get; set; }

        [JsonIgnore]
        public ICollection<LeaveApproval>? LeaveApprovals { get; set; } = new List<LeaveApproval>();
    }
}

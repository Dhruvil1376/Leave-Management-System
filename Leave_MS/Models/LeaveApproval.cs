using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Leave_MS.Models
{
    public class LeaveApproval
    {
        [Key]
        public int ApprovalId { get; set; }

        [Required,ForeignKey("LeaveRequest")]
        public int LeaveRequestId { get; set; }

        [Required,ForeignKey("ApprovedByUser")]
        public int ApprovedBy { get; set; }

        [Required,MaxLength(20)]
        public string Action {  get; set; } = string.Empty;

        [MaxLength(200)]
        public string Comments { get; set; } = string.Empty;
        public DateTime ActionDate {  get; set; } = DateTime.Now;
        public LeaveRequest? LeaveRequest { get; set; }
        public User? ApprovedByUser { get; set; }
    }
}

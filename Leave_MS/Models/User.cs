using Microsoft.EntityFrameworkCore.SqlServer;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Leave_MS.Models
{
    public class User
    {
        [Key]
        public int UserId {  get; set; }

        [Required,ForeignKey("Role")]
        public int RoleId {  get; set; }

        [Required,MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required,MaxLength(100),EmailAddress]
        public string Email {  get; set; } = string.Empty;

        [Required,MaxLength(50)]
        public string Password {  get; set; } = string.Empty;
        public bool isActive { get; set; } = true;

        [Required,MaxLength (500)]
        public string ProfileImage {  get; set; } = string.Empty;

        [JsonIgnore]
        public Role? Role { get; set; }

        [JsonIgnore]
        public ICollection<LeaveBalance>? LeaveBalances { get; set; } = new List<LeaveBalance>();

        [JsonIgnore]
        public ICollection<LeaveRequest>? LeaveRequests { get; set; } = new List<LeaveRequest>();

        [JsonIgnore]
        public ICollection<LeaveApproval>? LeaveApprovals { get; set; } = new List<LeaveApproval>();
    }
}

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Leave_MS.Models
{
    public class Status
    {
        [Key]
        public int StatusId { get; set; }

        [Required,MaxLength(20)]
        public string StatusName { get; set; } = string.Empty;

        [Required,MaxLength(50)]
        public string StatusCssClass { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<LeaveRequest>? LeaveRequests { get; set; } = new List<LeaveRequest>();
    }
}

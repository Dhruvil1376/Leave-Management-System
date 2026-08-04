using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Leave_MS.Models
{
    public class LeaveBalance
    {
        [Key]
        public int LeaveBalanceId { get; set; }

        [Required,ForeignKey("User")]
        public int UserId { get; set; }

        [Required,ForeignKey("LeaveType")]
        public int LeaveTypeId { get; set; }

        [Required,ForeignKey("CalendarYear")]
        public int CalendarYearId { get; set; }

        [Required]
        public int AllocatedDays { get; set; }

        public int UsedDays { get; set; } = 0;

        [JsonIgnore]
        public User? User { get; set; }

        [JsonIgnore]
        public LeaveType? LeaveType { get; set; }

        [JsonIgnore]
        public CalendarYear? CalendarYear { get; set; }
    }
}

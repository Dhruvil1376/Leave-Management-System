using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Leave_MS.Models
{
    public class CalendarYear
    {
        [Key]
        public int CalendarYearId { get; set; }

        [Required,MaxLength(20)]
        public string CalendarYearName { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [JsonIgnore]
        public ICollection<LeaveBalance>? LeaveBalances { get; set; } = new List<LeaveBalance>();
    }
}

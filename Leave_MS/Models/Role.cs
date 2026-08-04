using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Leave_MS.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        [Required,MaxLength(50)]
        public string RoleName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Description { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<User>? Users { get; set; } = new List<User>();
    }
}

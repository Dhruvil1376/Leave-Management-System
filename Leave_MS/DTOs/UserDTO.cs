namespace Leave_MS.DTOs
{
    public class UserDTO
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; }
        public bool IsActive { get; set; } = true;
        public string ProfileImage { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string? RoleName { get; set; }
    }
}

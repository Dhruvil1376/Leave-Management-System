namespace Leave_MS.DTOs
{
    public class LeaveTypeDTO
    {
        public int LeaveTypeId { get; set; }
        public string LeaveTypeName { get; set; } = string.Empty;
        public string? CssClass { get; set; } = string.Empty;
    }
}

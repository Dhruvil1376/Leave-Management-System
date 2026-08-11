namespace Leave_MS.DTOs
{
    public class LeaveRequestDTO
    {
        public int LeaveRequestId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TotalDays { get; set; }
        public string Reason { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public int LeaveTypeId { get; set; }
        public string? LeaveTypeName { get; set; }
        public int StatusId { get; set; }
        public string? StatusName { get; set; }
    }
}

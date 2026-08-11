namespace Leave_MS.DTOs
{
    public class LeaveBalanceDTO
    {
        public int LeaveBalanceId { get; set; }
        public int AllocatedDays { get; set; }
        public int UsedDays { get; set; } = 0;
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public int LeaveTypeId { get; set; }
        public string? LeaveTypeName { get; set; }
        public int CalendarYearId { get; set; }
        public string? CalendarYearName { get; set; }
    }
}
